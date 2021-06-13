import { EntityRepository, Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userSignUpDto: UserSignUpDto): Promise<void> {
    const { username, password } = userSignUpDto;
    const user = this.create({ username, password });
    await this.save(user);
  }
}
