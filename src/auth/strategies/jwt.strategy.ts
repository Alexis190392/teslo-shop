import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { use } from "passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    configService: ConfigService, //debo colocar el import en el modulo

  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      //para mandarlo como bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    });
  }

  async validate( payload: any): Promise<User>{

    const {email} = payload;

    const user = await this.userRepository.findOneBy({email});

    if (!user)
      throw new UnauthorizedException('Token no válido')

    if (!user.isActive)
      throw new UnauthorizedException('Usuario inactivo')

    return user;
  }
}