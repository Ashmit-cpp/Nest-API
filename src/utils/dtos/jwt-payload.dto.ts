// src/auth/dtos/jwt-payload.dto.ts

export interface JwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}
