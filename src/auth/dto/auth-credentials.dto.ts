import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  username: string

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Passwords will contain at least 1 upper case letter
    Passwords will contain at least 1 lower case letter
    Passwords will contain at least 1 number or special character`
  })
  password: string
}
