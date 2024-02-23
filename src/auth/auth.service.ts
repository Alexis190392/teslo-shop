import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from "./dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }


  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;

      //preparo user
      const user = this.userRepository.create({
        ...userData,
        password:bcrypt.hashSync( password, 10)
      });

      await this.userRepository.save(user); //guardo user en bd

      delete user.password

      return user;


    }catch (e) {
      this.handleDbExceptions(e);
    }
  }


  async login(loginUserDto: LoginUserDto){
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password:true} //para recibir unicamente estos datos

    })

    if (!user)
      throw new UnauthorizedException(`Credenciales no validas para ${email}`)

    // Tomo la contraseña y veo mediante el hash si es la misma
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credenciales no validas para ${password}`)

    return user;

  }



  private handleDbExceptions(error: any): never{
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException("Ver logs")

  }

}
