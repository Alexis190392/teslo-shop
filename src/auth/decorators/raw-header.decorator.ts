import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
  (data, context : ExecutionContext)=>{

    const req = context.switchToHttp().getRequest();

    return req.rawHeaders;

  }
)