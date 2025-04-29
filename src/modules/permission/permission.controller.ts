import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { PermissionService } from './permission.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from 'src/common/constants/permission.enum'
import { PermissionResponseDto } from './dto/index.dto'
import { PermissionSummary } from '../../config/summary/permission.summary'

@ApiTags('Permission')
@ApiSecurity('bearer')
@Controller('permission')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    @ApiOkResponse({ type: PermissionResponseDto })
    @HasPermissions(PermissionEnum.PlanGetAll)
    @ApiOperation({ summary: PermissionSummary.GET_ALL })
    async findAll() {
        return this.permissionService.findAll()
    }

    @Get(':id')
    @ApiOkResponse({ type: PermissionResponseDto })
    @HasPermissions(PermissionEnum.PlanGet)
    @ApiOperation({ summary: PermissionSummary.GET_ONE })
    async findOne(@Param('id') id: string) {
        return this.permissionService.findOne(id)
    }
}
