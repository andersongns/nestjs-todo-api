import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserSignUpDto } from 'src/user/dto/user-sign-up.dto'
import { UserRepository } from 'src/user/user.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { AuthDto, AuthPayloadDto } from './dto/auth-payload.dto'

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signUp (authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const found = await this.userRepository.findOne({ username })
    if (found != null) throw new ConflictException(`Username ${username} already exists`)

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const userSignUpDto: UserSignUpDto = {
      username,
      password: hashedPassword
    }

    return await this.userRepository.signUp(userSignUpDto)
  }

  async signIn (authCredentialsDto: AuthCredentialsDto): Promise<AuthDto> {
    const { username, password } = authCredentialsDto

    const user = await this.userRepository.findOne({ username })
    if (user == null) throw new UnauthorizedException()
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) throw new UnauthorizedException()
    const payload: AuthPayloadDto = { username }

    const token = await this.jwtService.sign(payload)
    const result: AuthDto = { token }
    return result
  }
}
