import { ApiAuth, ApiPublic } from '@/decorators/http-decorators';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
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
import { ForgotPasswordReqDto } from './dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from './dto/forgot-password.res.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';
import { ResetPasswordResDto } from './dto/reset-password.res.dto';
import { VerifyEmailResDto } from './dto/verify-email.res.dto';

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

  @ApiPublic({
    type: ForgotPasswordResDto,
    summary: 'Forgot password',
  })
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.forgotPassword(dto);
  }

  @ApiPublic({
    type: ResetPasswordResDto,
    summary: 'Reset password',
  })
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordReqDto,
  ): Promise<ResetPasswordResDto> {
    return await this.authService.resetPassword(dto);
  }

  @ApiPublic({
    type: VerifyEmailResDto,
    summary: 'Verify user email',
  })
  @Get('verify/email')
  async verifyEmail(@Query('token') token: string): Promise<VerifyEmailResDto> {
    if (!token) {
      throw new BadRequestException('Token is required.');
    }
    return await this.authService.verifyEmail(token);
  }

  @ApiPublic()
  @Post('verify/email/resend')
  resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
