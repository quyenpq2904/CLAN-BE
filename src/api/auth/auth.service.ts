import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { hashPassword, verifyPassword } from '@/utils/password.util';
import crypto from 'crypto';
import { SessionEntity } from '../user/entities/session.entity';
import { plainToInstance } from 'class-transformer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtPayloadType } from './types/jwt-payload.type';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { ValidationException } from '@/exceptions/validation.exception';
import { ErrorCode } from '@/constants/error-code.constant';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { createCacheKey } from '@/utils/cache.util';
import { CacheKey } from '@/constants/cache.constant';
import { CacheService } from '@/cache/cache.service';
import ms, { StringValue } from 'ms';
import { InjectQueue } from '@nestjs/bullmq';
import { JobName, QueueName } from '@/constants/job.constant';
import { Queue } from 'bullmq';
import {
  IEmailJob,
  IForgotPasswordJob,
  IVerifyEmailJob,
} from '@/common/interfaces/job.interface';
import { ForgotPasswordReqDto } from './dto/forgot-password.req.dto';
import { ForgotPasswordResDto } from './dto/forgot-password.res.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';
import { ResetPasswordResDto } from './dto/reset-password.res.dto';
import { JwtForgotPasswordPayloadType } from './types/jwt-forgot-password-payload.type';
import { VerifyEmailResDto } from './dto/verify-email.res.dto';
import { JwtEmailVerificationPayloadType } from './types/jwt-email-verification-payload.type';

type Token = Branded<
  {
    accessToken: string;
    refreshToken: string;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cacheService: CacheService,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob, any, string>,
  ) {}

  /**
   * Sign in user
   * @param dto LoginReqDto
   * @returns LoginResDto
   */
  async signIn(dto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = new SessionEntity({
      hash,
      userId: user.id,
    });
    await session.save();

    const token = await this.createToken({
      id: user.id,
      sessionId: session.id,
      hash,
    });

    return plainToInstance(LoginResDto, {
      userId: user.id,
      ...token,
    });
  }

  async register(dto: RegisterReqDto): Promise<RegisterResDto> {
    const isExistUser = await UserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    const user = new UserEntity({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
    });

    await user.save();

    const token = await this.createVerificationToken({ id: user.id });
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );
    await this.cacheService.set(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, user.id),
      token,
      ms(tokenExpiresIn as StringValue),
    );
    await this.emailQueue.add(
      JobName.EMAIL_VERIFICATION,
      {
        email: dto.email,
        token,
      } as IVerifyEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(RegisterResDto, {
      userId: user.id,
    });
  }

  async logout(userToken: JwtPayloadType): Promise<void> {
    await this.cacheService.set<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, userToken.sessionId),
      true,
      userToken.exp * 1000 - Date.now(),
    );
    await SessionEntity.delete(userToken.sessionId);
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { sessionId, hash } = this.verifyRefreshToken(dto.refreshToken);
    const session = await SessionEntity.findOneBy({ id: sessionId });

    if (!session || session.hash !== hash) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: session.userId },
      select: ['id'],
    });

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await SessionEntity.update(session.id, { hash: newHash });

    return await this.createToken({
      id: user.id,
      sessionId: session.id,
      hash: newHash,
    });
  }

  async forgotPassword(
    dto: ForgotPasswordReqDto,
  ): Promise<ForgotPasswordResDto> {
    const user = await this.userRepository.findOneOrFail({
      where: { email: dto.email },
      select: ['id', 'email'],
    });

    const token = await this.createForgotPasswordToken({ id: user.id });
    const tokenExpiresIn = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });
    await this.cacheService.set(
      createCacheKey(CacheKey.FORGOT_PASSWORD, user.id),
      token,
      ms(tokenExpiresIn as StringValue),
    );
    await this.emailQueue.add(
      JobName.FORGOT_PASSWORD,
      {
        email: dto.email,
        token,
      } as IForgotPasswordJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    return plainToInstance(ForgotPasswordResDto, {
      email: user.email,
    });
  }

  async resetPassword(dto: ResetPasswordReqDto): Promise<ResetPasswordResDto> {
    const { id } = this.verifyForgotPasswordToken(dto.token);
    const cacheKey = createCacheKey(CacheKey.FORGOT_PASSWORD, id);
    const storedToken = await this.cacheService.get<string>(cacheKey);

    if (!storedToken || storedToken !== dto.token) {
      throw new UnauthorizedException(ErrorCode.E004);
    }

    const newPasswordHash = await hashPassword(dto.newPassword);

    await this.userRepository.update(id, {
      password: newPasswordHash,
    });
    await this.cacheService.delete(cacheKey);

    return plainToInstance(ResetPasswordResDto, {
      userId: id,
    });
  }

  async verifyEmail(token: string): Promise<VerifyEmailResDto> {
    const { id } = this.verifyVerificationToken(token);

    const cacheKey = createCacheKey(CacheKey.EMAIL_VERIFICATION, id);

    const storedToken = await this.cacheService.get<string>(cacheKey);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException(ErrorCode.E004);
    }

    //TODO: update user isVerified field
    // await this.userRepository.update(id, {
    //   isVerified: true,
    // });

    await this.cacheService.delete(cacheKey);

    return plainToInstance(VerifyEmailResDto, {
      userId: id,
    });
  }

  private async createToken(data: {
    id: string;
    sessionId: string;
    hash: string;
  }): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: data.id,
          role: '',
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: this.configService.getOrThrow('auth.expires', {
            infer: true,
          }),
        },
      ),
      this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    } as Token;
  }

  private async createVerificationToken(data: { id: string }): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
  }

  private async createForgotPasswordToken(data: {
    id: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.forgotExpires', {
          infer: true,
        }),
      },
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Force logout if the session is in the blacklist
    const isSessionBlacklisted = await this.cacheService.get<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, payload.sessionId),
    );

    if (isSessionBlacklisted) {
      throw new UnauthorizedException();
    }

    return payload;
  }

  private verifyRefreshToken(token: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private verifyForgotPasswordToken(
    token: string,
  ): JwtForgotPasswordPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private verifyVerificationToken(
    token: string,
  ): JwtEmailVerificationPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
