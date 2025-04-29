import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { ConfirmTwoFactorDto, DecodedUser, SelfUserUpdateDto, TwoFactorAuthDto } from '../auth/dto'
import { Request } from 'express'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { UserSearchDto } from './dto/search.dto'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { UserSummary } from '../../config/summary/user.summary'
import { DecodeUser } from '../auth/decorators/decode-user.decorator'

@ApiTags('User')
@Controller('user')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: UserSummary.SELF_INFO })
    @Get('self')
    async findOne(@DecodeUser() user: DecodedUser) {
        return this.userService.findOneById(user.id, false)
    }

    @ApiOperation({ summary: UserSummary.SELF_UPDATE })
    @Patch()
    async update(@DecodeUser() user: DecodedUser, @Body() dto: SelfUserUpdateDto) {
        return this.userService.update(user.id, dto)
    }

    @ApiOperation({ summary: UserSummary.TWO_FACTOR_REQUEST })
    @Post('two-factor-auth')
    @HttpCode(HttpStatus.OK)
    async twoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto, @DecodeUser() user: DecodedUser) {
        return this.userService.twoFactorAuth(user.id, twoFactorAuthDto)
    }

    @ApiOperation({ summary: UserSummary.TWO_FACTOR_CONFIRM })
    @Patch('two-factor-auth')
    async confirmTwoFactorAuth(@DecodeUser() user: DecodedUser, @Req() req: Request, @Body() dto: ConfirmTwoFactorDto) {
        return this.userService.confirmTwoFactorAuth(req.ip, user.id, dto)
    }

    @ApiOperation({ summary: UserSummary.GET })
    @Post('search')
    @HasPermissions(PermissionEnum.UserGet)
    @HttpCode(HttpStatus.OK)
    async find(@Body() dto: UserSearchDto) {
        return this.userService.search(dto)
    }
}
