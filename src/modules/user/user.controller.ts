import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { JwtPayload } from '../auth/decorators/jwt-payload.decorator'
import { ConfirmTwoFactorDto, JwtPayloadDto, SelfUserUpdateDto, TwoFactorAuthDto } from '../auth/dto'
import { Request } from 'express'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { UserSearchDto } from './dto/search.dto'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { UserSummary } from '../../config/summary/user.summary'

@ApiTags('User')
@Controller('user')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: UserSummary.SELF_INFO })
    @Get('self')
    async findOne(@JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.userService.findOneById(jwtPayload.id, false)
    }

    @ApiOperation({ summary: UserSummary.SELF_UPDATE })
    @Patch()
    async update(@JwtPayload() jwtPayload: JwtPayloadDto, @Body() dto: SelfUserUpdateDto) {
        return this.userService.update(jwtPayload.id, dto)
    }

    @ApiOperation({ summary: UserSummary.TWO_FACTOR_REQUEST })
    @Post('two-factor-auth')
    @HttpCode(HttpStatus.OK)
    async twoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto, @JwtPayload() jwtPayload: JwtPayloadDto) {
        return this.userService.twoFactorAuth(jwtPayload.id, twoFactorAuthDto)
    }

    @ApiOperation({ summary: UserSummary.TWO_FACTOR_CONFIRM })
    @Patch('two-factor-auth')
    async confirmTwoFactorAuth(@JwtPayload() jwtPayload: JwtPayloadDto, @Req() req: Request, @Body() dto: ConfirmTwoFactorDto) {
        return this.userService.confirmTwoFactorAuth(req.ip, jwtPayload.id, dto)
    }

    @ApiOperation({ summary: UserSummary.GET })
    @Post('search')
    @HasPermissions(PermissionEnum.UserGet)
    @HttpCode(HttpStatus.OK)
    async find(@Body() dto: UserSearchDto) {
        return this.userService.search(dto)
    }
}
