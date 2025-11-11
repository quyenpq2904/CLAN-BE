import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginResDto } from './dto/login.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { JwtPayloadType } from './types/jwt-payload.type';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in',
  })
  @Post('login')
  async signIn(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLogin);
  }

  @ApiPublic({
    type: RegisterResDto,
    summary: 'Register',
  })
  @Post('register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authService.register(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiPublic()
  @Post('forgot-password')
  forgotPassword() {
    return 'forgot-password';
  }

  @ApiPublic()
  @Post('verify/forgot-password')
  verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @ApiPublic()
  @Post('reset-password')
  resetPassword() {
    return 'reset-password';
  }

  @ApiPublic()
  @Get('verify/email')
  verifyEmail() {
    return 'verify-email';
  }

  @ApiPublic()
  @Post('verify/email/resend')
  resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
