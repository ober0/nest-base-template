import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiCreatedResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { RoleCreateDto, RoleUpdateDto } from './dto'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { ActiveGuard } from '../auth/guards/active.guard'
import { PermissionGuard } from '../role-permission/guards/permission.guard'
import { HasPermissions } from '../role-permission/decorators/permissions.decorator'
import { PermissionEnum } from 'src/common/constants/permission.enum'
import { RoleResponseDto } from './res'
import { RoleSummary } from '../../config/summary/role.summary'

@ApiTags('Role')
@ApiSecurity('bearer')
@Controller('role')
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @ApiCreatedResponse({ type: RoleResponseDto })
    @HasPermissions(PermissionEnum.RoleCreate)
    @ApiOperation({ summary: RoleSummary.CREATE_ROLE_SUMMARY })
    async create(@Body() roleDto: RoleCreateDto) {
        return this.roleService.create(roleDto)
    }

    @Get(':uuid')
    @ApiCreatedResponse({ type: RoleResponseDto })
    @HasPermissions(PermissionEnum.RoleGet)
    @ApiOperation({ summary: RoleSummary.GET_ONE_ROLE_SUMMARY })
    async findOne(@Param('uuid') uuid: string) {
        return this.roleService.findOne(uuid)
    }

    @Get()
    @ApiCreatedResponse({ type: [RoleResponseDto] })
    @HasPermissions(PermissionEnum.RoleGetAll)
    @ApiOperation({ summary: RoleSummary.GET_ALL_ROLES_SUMMARY })
    async findAll() {
        return this.roleService.findAll()
    }

    @Patch(':uuid')
    @ApiCreatedResponse({ type: RoleResponseDto })
    @HasPermissions(PermissionEnum.RoleUpdate)
    @ApiOperation({ summary: RoleSummary.UPDATE_ROLE_SUMMARY })
    async update(@Param('uuid') uuid: string, @Body() roleDto: RoleUpdateDto) {
        return this.roleService.update(uuid, roleDto)
    }

    @Delete(':uuid')
    @HasPermissions(PermissionEnum.RoleDelete)
    @ApiOperation({ summary: RoleSummary.DELETE_ROLE_SUMMARY })
    async delete(@Param('uuid') id: string) {
        return this.roleService.delete(id)
    }
}
