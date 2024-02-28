import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "./entities/user.entity";
import { UserRoleGuard } from "./guards/user-role.guard";
import { ValidRoles } from "./interfaces";
import { Auth, GetUser, RawHeaders, RoleProtected } from "./decorators";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  //
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request:Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    // @Headers() headers: IncomingHttpHeaders,
    @RawHeaders() rawHeaders:string[],

  ){
    return {
      status: 'ok',
      user,
      // headers,
      rawHeaders
    }
  }

  @Get('private2')
  // @SetMetadata('roles',['admin','super-user'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok:true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok:true,
      user
    }
  }

}
