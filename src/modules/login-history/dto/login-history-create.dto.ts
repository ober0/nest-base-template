import { ApiProperty } from '@nestjs/swagger'
import { LoginHistoryBaseDto } from './login-history-base.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginHistoryCreateDto extends LoginHistoryBaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string
}
