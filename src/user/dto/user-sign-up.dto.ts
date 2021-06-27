import { IsNotEmpty } from 'class-validator'

export class UserSignUpDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}
