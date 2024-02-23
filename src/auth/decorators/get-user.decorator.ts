import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
  (data, context : ExecutionContext)=>{

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('No se encontró usuario en request');

    return (!data)?user:user[data];
  }
)