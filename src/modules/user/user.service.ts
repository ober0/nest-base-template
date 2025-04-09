import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { createHash, randomBytes } from 'crypto'
import * as fs from 'fs'

import { RedisService } from 'src/modules/redis/redis.service'
import { SmtpService } from 'src/modules/smtp/smtp.service'
import { RoleService } from '../role/role.service'
import { PasswordService } from '../password/password.service'
import { UserRepository } from './user.repository'

import { ConfirmChangePasswordDto, SelfUserUpdateDto, SignUpUserDto, TwoFactorAuthDto } from '../auth/dto'

const ATTEMPT_LIMIT = 5
const ATTEMPT_TTL = 600
const TWO_FACTOR_TTL = 300

@Injectable()
export class UserService {
    constructor(
        private readonly roleService: RoleService,
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly redis: RedisService,
        private readonly smtpService: SmtpService
    ) {}

    async create(userDto: SignUpUserDto) {
        if (await this.userRepository.existsByEmail(userDto.email)) {
            throw new ConflictException('Пользователь с таким email существует')
        }

        const roleUuid = (await this.roleService.findOneByName('user')).uuid
        const hashedPassword = await this.passwordService.hashPassword(userDto.password)
        const { password, ...rest } = userDto

        return this.userRepository.create({
            ...rest,
            hashedPassword,
            role: { connect: { uuid: roleUuid } }
        })
    }

    async findOneByEmail(email: string, withPassword = true) {
        const user = await this.userRepository.findOneByEmail(email)
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }
        if (!withPassword) {
            delete user.hashedPassword
        }
        return user
    }

    async findOneByUuid(uuid: string, withPassword = true) {
        const user = await this.userRepository.findOneByUuid(uuid)
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        const logoPath = `./media/users/avatars/${user.avatar}`
        let avatar: string | null = null

        try {
            if (fs.existsSync(logoPath)) {
                const base64 = fs.readFileSync(logoPath, { encoding: 'base64' })
                avatar = `data:image/png;base64,${base64}`
            }
        } catch {
            avatar = null
        }

        const { hashedPassword, roleUuid, ...userWithoutSensitiveInfo } = user
        if (!withPassword) {
            return { ...userWithoutSensitiveInfo, avatar }
        }

        return { ...userWithoutSensitiveInfo, hashedPassword, avatar }
    }

    async update(uuid: string, userUpdateDto: SelfUserUpdateDto) {
        return this.userRepository.update(uuid, userUpdateDto)
    }

    private async generateHash(length = 16): Promise<string> {
        const randomData = randomBytes(32).toString('hex')
        const hash = createHash('sha256').update(randomData).digest('hex')
        return hash.substring(0, length)
    }

    private generate6DigitCode(): number {
        return Math.floor(100000 + Math.random() * 900000)
    }

    private async checkConfirmAttempts(ip: string) {
        const usedAttempts = await this.redis.get(`confirm-attempts-${ip}`)
        const attempts = Number(usedAttempts)
        if (Number.isNaN(attempts) || attempts >= ATTEMPT_LIMIT) {
            throw new BadRequestException('Много попыток')
        }
        return true
    }

    async twoFactorAuth(uuid: string, twoFactorAuthDto: TwoFactorAuthDto) {
        const code = this.generate6DigitCode()
        const hash = await this.generateHash()
        const user = await this.findOneByUuid(uuid)

        const userData = JSON.stringify({
            uuid,
            on: twoFactorAuthDto.on,
            code,
            email: user.email
        })

        await this.redis.set(`twoFactor-${hash}`, userData, TWO_FACTOR_TTL)

        this.smtpService.send(user.email, `Ваш код подтверждения: ${code}`, `Код подтверждения ${twoFactorAuthDto.on ? 'включения' : 'отключения'} 2FA`)

        return {
            msg: 'Код отправляется',
            hash
        }
    }

    async confirmTwoFactorAuth(ip: string, uuid: string, { hash, code }: ConfirmChangePasswordDto) {
        const userData = await this.redis.get(`twoFactor-${hash}`)
        if (!userData || typeof userData !== 'string') {
            throw new NotFoundException()
        }

        let JsonUserData: any
        try {
            JsonUserData = JSON.parse(userData)
        } catch {
            throw new BadRequestException('Данные повреждены')
        }

        if (uuid !== JsonUserData.uuid) {
            throw new UnauthorizedException('Нет доступа')
        }

        await this.checkConfirmAttempts(ip)

        if (Number(code) !== JsonUserData.code) {
            await this.redis.incrementWithTTL(`confirm-attempts-${ip}`, 1, ATTEMPT_TTL)
            throw new BadRequestException('Неверный код')
        }

        return this.userRepository.updateTwoFactor(uuid, { on: JsonUserData.on })
    }
}
