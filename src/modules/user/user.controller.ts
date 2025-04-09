import { Body, Controller, Get, Patch, Post, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { ConfirmTwoFactorDto, JwtPayloadDto, SelfUserUpdateDto, TwoFactorAuthDto } from '../auth/dto'
import { Request } from 'express'
import { UserSummary } from '../../config/summary/user.summary'

@ApiTags('User Main')
@Controller('user')
@UseGuards(JwtAuthGuard, ActiveGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiSecurity('bearer')
    @ApiOperation({ summary: UserSummary.SELF_INFO })
    @Get('self')
    async findOne(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.userService.findOneByUuid(jwtPayload.uuid, false)
    }

    @ApiSecurity('bearer')
    @ApiOperation({ summary: UserSummary.SELF_UPDATE })
    @Patch()
    async update(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: SelfUserUpdateDto) {
        return this.userService.update(jwtPayload.uuid, dto)
    }

    @ApiSecurity('bearer')
    @ApiOperation({ summary: UserSummary.TWO_FACTOR_REQUEST })
    @Post('two-factor-auth')
    @HttpCode(HttpStatus.OK)
    async twoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto, @JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.userService.twoFactorAuth(jwtPayload.uuid, twoFactorAuthDto)
    }

    @ApiSecurity('bearer')
    @ApiOperation({ summary: UserSummary.TWO_FACTOR_CONFIRM })
    @Patch('two-factor-auth')
    async confirmTwoFactorAuth(@JwtPayload() jwtPayload: JwtPayloadDto, @Req() req: Request, @Body() dto: ConfirmTwoFactorDto) {
        return this.userService.confirmTwoFactorAuth(req.ip, jwtPayload.uuid, dto)
    }
}
