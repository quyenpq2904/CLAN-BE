import { UserRole } from '@/api/user/entities/user.entity';

export type JwtPayloadType = {
  id: string;
  sessionId: string;
  role: UserRole;
  iat: number;
  exp: number;
};
