import { Req, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../core/decorator/public.decorator';
import { UserDataConverter } from '../data-converter/user.data-converter';
import { PayloadDto } from '../dto/payload.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { LoginAuthGuard } from '../guard/login.guard';
import { AuthService } from '../service/auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userDataConverter: UserDataConverter,
  ) {}

  @Public()
  @UseGuards(LoginAuthGuard)
  @Post('/login')
  public async login(@Req() req): Promise<PayloadDto> {
    return this.authService
      .login(req.user)
      .then((accessToken: string) =>
        this.userDataConverter.toPayloadDto(req.user, accessToken),
      );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected_check')
  public check(): string {
    return 'OK';
  }
}
