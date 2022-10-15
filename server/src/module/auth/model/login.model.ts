import { IsString, Length, Matches } from 'class-validator';

export class Login {
  @IsString({ message: 'Login value must be a string.' })
  @Length(4, 84)
  public login: string;

  @IsString({ message: 'Password value must be a string.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak.',
  })
  @Length(8, 128)
  public password: string;
}
