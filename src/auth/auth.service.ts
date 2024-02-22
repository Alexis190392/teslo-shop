import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }


  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto); //preparo user

      await this.userRepository.save(user); //guardo user en bd

      return user;


    }catch (e) {
      this.handleDbExceptions(e);
    }
  }

  private handleDbExceptions(error: any): never{
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException("Ver logs")

  }

}
