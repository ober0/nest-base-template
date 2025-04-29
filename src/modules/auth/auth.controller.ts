import { Controller, Post, Body, HttpStatus, HttpCode, Get, Query, Req, Patch } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
    ChangePasswordNoAuthDto,
    ConfirmChangePasswordDto,
    ConfirmSignUpUserDto,
    RefreshTokenDto,
    ResendConfirmCodeDto,
    SignInResponseUserDto,
    SignInUserDto,
    SignUpResponseUserDto,
    SignUpUserDto
} from './dto'
import { AccessRefreshTokenResponseDto, AccessTokenResponseDto, LoginResponseDto } from './res'
import { Request } from 'express'
import { AuthSummary } from '../../common/summary/auth.summary'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOkResponse({ type: SignUpResponseUserDto })
    @ApiOperation({ summary: AuthSummary.SIGNUP })
    async signUp(@Body() signUpDto: SignUpUserDto) {
        return this.authService.signUp(signUpDto)
    }

    @Post('signup/confirm')
    @ApiOkResponse({ type: AccessRefreshTokenResponseDto })
    @ApiOperation({ summary: AuthSummary.SIGNUP_CONFIRM })
    async confirmSignUp(@Body() signUpDto: ConfirmSignUpUserDto) {
        return this.authService.confirmSignUp(signUpDto)
    }

    @Post('signin')
    @ApiOkResponse({ type: SignInResponseUserDto })
    @ApiOperation({ summary: AuthSummary.SIGNIN })
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signInDto: SignInUserDto, @Req() request: Request) {
        return this.authService.signIn(signInDto, request.ip)
    }

    @Post('signin/confirm')
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiOperation({ summary: AuthSummary.SIGNIN_CONFIRM })
    @HttpCode(HttpStatus.OK)
    async confirmSignIn(@Body() confirmUserDto: ConfirmSignUpUserDto, @Req() request: Request) {
        return this.authService.confirmSignIn(confirmUserDto, request.ip)
    }

    @Post('refresh')
    @ApiOkResponse({ type: AccessTokenResponseDto })
    @ApiOperation({ summary: AuthSummary.REFRESH_TOKEN })
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() { refreshToken }: RefreshTokenDto) {
        return this.authService.refresh(refreshToken)
    }

    @Get('resend-code')
    @ApiOkResponse({ type: SignUpResponseUserDto })
    @ApiOperation({ summary: AuthSummary.RESEND_CODE })
    @HttpCode(HttpStatus.OK)
    async resendConfirmCode(@Query() hashDto: ResendConfirmCodeDto) {
        return this.authService.resendConfirmCode(hashDto)
    }

    @ApiOperation({ summary: AuthSummary.CHANGE_PASSWORD })
    @Post('change-password')
    async changePassword(@Body() dto: ChangePasswordNoAuthDto) {
        return this.authService.changePassword(dto)
    }

    @ApiOperation({ summary: AuthSummary.CONFIRM_CHANGE_PASSWORD })
    @Patch('change-password/confirm')
    async confirmChangePassword(@Req() req: Request, @Body() dto: ConfirmChangePasswordDto) {
        return this.authService.confirmChangePassword(req.ip, dto)
    }
}
