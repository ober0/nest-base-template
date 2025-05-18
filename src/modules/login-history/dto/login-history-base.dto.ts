import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginHistoryBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userAgent: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ip: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    fingerprint?: string
}
