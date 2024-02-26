import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Reflector } from "@nestjs/core";
import { User } from "../../entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get('roles', context.getHandler())

    //validar que existan o no
    if (!validRoles) return true;
    //si no hay roles, deja pasar
    if (validRoles.length === 0) return true;


    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new BadRequestException('Usuario no encontrado');


    for (const role of user.roles){
      if (validRoles.includes(role)){
        return true
      }
    }

    throw new ForbiddenException(`El usuario ${user.fullName} necesitar un rol válido. Su rol es: ${validRoles} `)


    return true;
  }
}
