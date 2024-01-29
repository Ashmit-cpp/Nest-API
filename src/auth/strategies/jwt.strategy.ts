import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/utils/dtos/jwt-payload.dto';
import { AuthUsersService } from '../services/auth-users/auth-users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthUsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'randomstring',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return { username: user.email };
  }
}
