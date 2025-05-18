import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { LoginHistoryService } from './login-history.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { SummaryEnum } from './consts/login-history.summary'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { LoginHistorySearchDto } from './dto/login-history-search.dto'
import { PrepareLoginHistorySearch } from './decorators/prepare-search.decorator'
import { PermissionEnum } from '../../common/constants/permission.enum'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'

@ApiTags('Login History')
@Controller('login-history')
@ApiSecurity('bearer')
export class LoginHistoryController {
    constructor(private readonly service: LoginHistoryService) {}

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
    @HasPermissions(PermissionEnum.LoginHistorySearch)
    @ApiOperation({ summary: SummaryEnum.LoginHistorySearch })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiBody({ type: LoginHistorySearchDto })
    async search(@PrepareLoginHistorySearch() dto: LoginHistorySearchDto) {
        return this.service.search(dto)
    }
}
