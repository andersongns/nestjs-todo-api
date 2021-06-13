import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthDto } from './dto/auth-payload.dto';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`User ${authCredentialsDto.username} try to create`);
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('sign-in')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthDto> {
    this.logger.verbose(`User ${authCredentialsDto.username} try to login`);
    return this.authService.signIn(authCredentialsDto);
  }
}
