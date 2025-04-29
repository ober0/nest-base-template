import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { createHash, randomBytes } from 'crypto'

import { RedisService } from 'src/modules/redis/redis.service'
import { SmtpService } from 'src/modules/smtp/smtp.service'
import { RoleService } from '../role/role.service'
import { PasswordService } from '../password/password.service'
import { UserRepository } from './user.repository'

import { ConfirmChangePasswordDto, SelfUserUpdateDto, SignUpUserDto, TwoFactorAuthDto } from '../auth/dto'
import { UserSearchDto } from './dto/search.dto'
import { ConfigService } from '@nestjs/config'
import { RolesEnum } from '../role/enum/roles.enum'

@Injectable()
export class UserService {
    constructor(
        private readonly roleService: RoleService,
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly redis: RedisService,
        private readonly smtpService: SmtpService,
        private readonly configService: ConfigService
    ) {}

    private readonly ATTEMPT_LIMIT: number = this.configService.get<number>('ATTEMPT_LIMIT')
    private readonly ATTEMPT_TTL: number = this.configService.get<number>('ATTEMPT_TTL')
    private readonly TWO_FACTOR_TTL: number = this.configService.get<number>('TWO_FACTOR_TTL')

    async create(dto: SignUpUserDto) {
        const { password, ...data } = dto
        const hashedPassword = await this.passwordService.hashPassword(password)

        const role = await this.roleService.findOneByName(RolesEnum.User)

        return this.userRepository.create({
            ...data,
            hashedPassword,
            roleId: role.id
        })
    }

    async findOneByEmail(email: string, withPassword = true) {
        const user = await this.userRepository.findOneByEmail(email)
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }
        if (!withPassword) {
            delete user.password
        }
        return user
    }

    async findOneById(id: string, withPassword = true) {
        const user = await this.userRepository.findOneById(id)
        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, roleId, ...userWithoutSensitiveInfo } = user
        if (!withPassword) {
            return userWithoutSensitiveInfo
        }

        return { ...userWithoutSensitiveInfo, password }
    }

    async update(id: string, userUpdateDto: SelfUserUpdateDto) {
        return this.userRepository.update(id, userUpdateDto)
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
        if (Number.isNaN(attempts) || attempts >= this.ATTEMPT_LIMIT) {
            throw new BadRequestException('Много попыток')
        }
        return true
    }

    async twoFactorAuth(id: string, twoFactorAuthDto: TwoFactorAuthDto) {
        const code = this.generate6DigitCode()
        const hash = await this.generateHash()
        const user = await this.findOneById(id)

        const userData = JSON.stringify({
            id,
            on: twoFactorAuthDto.on,
            code,
            email: user.email
        })

        await this.redis.set(`twoFactor-${hash}`, userData, this.TWO_FACTOR_TTL)

        this.smtpService.send(user.email, `Ваш код подтверждения: ${code}`, `Код подтверждения ${twoFactorAuthDto.on ? 'включения' : 'отключения'} 2FA`)

        return {
            msg: 'Код отправляется',
            hash
        }
    }

    async confirmTwoFactorAuth(ip: string, id: string, { hash, code }: ConfirmChangePasswordDto) {
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

        if (id !== JsonUserData.id) {
            throw new UnauthorizedException('Нет доступа')
        }

        await this.checkConfirmAttempts(ip)

        if (Number(code) !== JsonUserData.code) {
            await this.redis.incrementWithTTL(`confirm-attempts-${ip}`, 1, this.ATTEMPT_TTL)
            throw new BadRequestException('Неверный код')
        }

        return this.userRepository.updateTwoFactor(id, { on: JsonUserData.on })
    }

    async search(dto: UserSearchDto) {
        const [data, count] = await Promise.all([this.userRepository.search(dto), this.userRepository.count(dto)])

        return {
            data,
            count
        }
    }
}
