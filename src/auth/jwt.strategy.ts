import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_VERY_SECRET_KEY', // IMPORTANT: Use the same secret as in your AuthModule
    });
  }

  // This method is called after the token is successfully verified
  async validate(payload: any) {
    // The value returned here will be attached to the request object as `req.user`
    return { userId: payload.sub, phoneNumber: payload.phoneNumber };
  }
}