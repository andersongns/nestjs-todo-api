import { EntityRepository, Repository } from 'typeorm'
import { UserSignUpDto } from './dto/user-sign-up.dto'
import { User } from './user.entity'
import { InternalServerErrorException, Logger } from '@nestjs/common'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name, true)
  async signUp (userSignUpDto: UserSignUpDto): Promise<void> {
    const { username, password } = userSignUpDto
    try {
      const user = this.create({ username, password })
      await this.save(user)
    } catch (error) {
      this.logger.error(`Failed to create user ${JSON.stringify(userSignUpDto)}`, error.stack)
      throw new InternalServerErrorException()
    }
  }
}
