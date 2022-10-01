import { Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { LoginAuthGuard } from '../guard/login.guard';
import { AuthService } from '../service/auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginAuthGuard)
  @Post('/login')
  public async login(@Request() req): Promise<string> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected_check')
  public check(): string {
    return 'OK';
  }
}
