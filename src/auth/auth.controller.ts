import { Body, Controller, Post, Logger } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { AuthDto } from './dto/auth-payload.dto'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor (private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp (@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`User ${authCredentialsDto.username} try to create`)
    return await this.authService.signUp(authCredentialsDto)
  }

  @Post('sign-in')
  async signIn (@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthDto> {
    this.logger.verbose(`User ${authCredentialsDto.username} try to login`)
    return await this.authService.signIn(authCredentialsDto)
  }
}
