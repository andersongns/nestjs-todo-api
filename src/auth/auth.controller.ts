import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthDto } from './dto/auth-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('sign-in')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthDto> {
    return this.authService.signIn(authCredentialsDto);
  }
}
