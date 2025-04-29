import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { SortTypes } from '../../../common/dto/sort-types.dto'
import { SearchBaseDto } from '../../../common/dto/base-search.dto'

export class UserFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string

    @ApiProperty({ required: false })
    @IsOptional()
    firstName?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    twoFactor?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isForbidden?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    roleIds: string[]
}

export class UserSortDto {
    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    email?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    firstName?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    lastName?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    twoFactor?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    isForbidden?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    @IsEnum(SortTypes)
    isActive?: SortTypes

    @ApiProperty({ required: false, enum: SortTypes })
    @IsOptional()
    role: SortTypes
}

export class UserSearchDto extends SearchBaseDto<UserFilterDto, UserSortDto> {
    @ApiProperty({ type: UserFilterDto })
    @Type(() => UserFilterDto)
    filters?: UserFilterDto

    @ApiProperty({ type: UserSortDto })
    @Type(() => UserSortDto)
    sorts?: UserSortDto
}
