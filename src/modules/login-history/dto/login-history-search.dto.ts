import { LoginHistoryBaseDto } from './login-history-base.dto'
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { SortTypes } from '../../../common/dto/sort-types.dto'
import { UserFilterDto, UserSortDto } from '../../user/dto/search.dto'
import { SearchBaseDto } from '../../../common/dto/base-search.dto'

export class LoginHistorySortDto {
    @ApiProperty({ enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    createdAt?: SortTypes

    @ApiProperty({ enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    ip?: SortTypes

    @ApiProperty({ enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    userAgent?: SortTypes

    @ApiProperty({ type: UserSortDto })
    @IsOptional()
    @ValidateNested()
    user?: UserSortDto
}

export class LoginHistoryFiltersDto extends PartialType(LoginHistoryBaseDto) {
    @ApiProperty({ type: OmitType(UserFilterDto, ['isActive', 'isForbidden']) })
    @Type(() => OmitType(UserFilterDto, ['isActive', 'isForbidden']))
    @IsOptional()
    @ValidateNested()
    @IsObject()
    user?: Omit<UserFilterDto, 'isActive' | 'isForbidden'>
}

export class LoginHistorySearchDto extends SearchBaseDto<LoginHistoryFiltersDto, LoginHistorySortDto> {
    @ApiProperty({ type: LoginHistoryFiltersDto })
    @Type(() => LoginHistoryFiltersDto)
    declare filters?: LoginHistoryFiltersDto

    @ApiProperty({ type: LoginHistorySortDto })
    @Type(() => LoginHistorySortDto)
    declare sorts?: LoginHistorySortDto
}
