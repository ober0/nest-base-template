import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginHistoryBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userAgent: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ip: string
}
