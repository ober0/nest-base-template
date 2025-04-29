import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayloadDto } from '../auth/dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
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

    async verifyRefreshToken(token: string): Promise<JwtPayloadDto> {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>('REFRESH_SECRET')
            })
        } catch {
            throw new UnauthorizedException()
        }
    }
}
