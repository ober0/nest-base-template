import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { DecodedUser } from '../auth/dto'
import { I18nService } from 'nestjs-i18n'
import { getCurrentLang } from '../../i18n/utils'

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly i18n: I18nService
    ) {}

    async generateAccessToken(id: string, email: string): Promise<string> {
        return this.jwtService.sign({ id, email })
    }

    async generateRefreshToken(id: string, email: string): Promise<string> {
        return this.jwtService.sign(
            { id, email },
            {
                secret: this.configService.get<string>('REFRESH_SECRET'),
                expiresIn: '7d'
            }
        )
    }

    async verifyRefreshToken(token: string): Promise<DecodedUser> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('REFRESH_SECRET')
            })
        } catch {
            throw new UnauthorizedException(
                this.i18n.t('errors.jwt.invalid', {
                    lang: getCurrentLang()
                })
            )
        }
    }
}
