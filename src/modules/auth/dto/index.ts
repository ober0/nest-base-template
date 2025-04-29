import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator'
import { RolesEnum } from '../../role/enum/roles.enum'

export class HashDto {
    @ApiProperty()
    hash: string
}

export class ResendConfirmCodeDto extends HashDto {
    @ApiProperty({ description: "action: 'signin' | 'signup' | 'change-email' | 'change-password' | 'deactivate' | 'activate' | 'delete' | 'change-password-no-auth' | 'twoFactor'" })
    action: 'signin' | 'signup' | 'change-email' | 'change-password' | 'deactivate' | 'activate' | 'delete' | 'change-password-no-auth' | 'twoFactor'
}

export class SignUpUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @IsPhoneNumber('RU')
    phoneNumber: string
}

export class ConfirmSignUpUserDto extends HashDto {
    @ApiProperty()
    @IsNumber()
    code: number
}

export class SignUpResponseUserDto extends HashDto {
    @ApiProperty()
    msg: string
}

export class SignInResponseUserDto extends SignUpResponseUserDto {}

export class SignInUserDto {
    @ApiProperty({ default: 'string@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    password: string
}

export class JwtPayloadDto {
    email: string
    id: string
    iat: number
    exp: number
    role: {
        name: RolesEnum
    }
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string
}

export class SelfUserUpdateDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    firstName?: string

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string
}

export class confirmDto {
    @ApiProperty()
    @IsString()
    hash: string

    @ApiProperty()
    @IsNumber()
    code: number
}

export class ChangeEmailDto {
    @ApiProperty()
    @IsEmail()
    email: string
}

export class ConfirmChangeEmailDto {
    @ApiProperty()
    @IsString()
    hash: string

    @ApiProperty()
    @IsNumber()
    code_old: number

    @ApiProperty()
    @IsNumber()
    code_new: number
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    password: string
}

export class ConfirmChangePasswordDto {
    @ApiProperty()
    @IsString()
    hash: string

    @ApiProperty()
    @IsNumber()
    code: number
}

export class UserOrganizationDto {
    @ApiProperty()
    @IsArray()
    ids: string[]
}

export class TwoFactorAuthDto {
    @ApiProperty()
    @IsBoolean()
    on: boolean
}

export class ConfirmTwoFactorDto {
    @ApiProperty()
    @IsString()
    hash: string

    @ApiProperty()
    @IsNumber()
    code: number
}

export class ChangePasswordNoAuthDto extends SignInUserDto {}
