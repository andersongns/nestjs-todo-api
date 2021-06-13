import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/user.entity";
import { UserRepository } from "src/user/user.repository";
import { AuthPayloadDto } from "./dto/auth-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: 'top-secret-51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: AuthPayloadDto): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });
        if(!user) throw new UnauthorizedException();

        return user;
    }
}