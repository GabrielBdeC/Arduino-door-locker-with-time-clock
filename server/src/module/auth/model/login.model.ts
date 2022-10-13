import { IsNotEmpty, IsString, Length } from 'class-validator';

export class Login {
  @IsNotEmpty({
    message: 'Logib value must not be empty. Please provide an login.',
  })
  @IsString({ message: 'Login value must be a string.' })
  @Length(6, 84)
  public login: string;

  @IsNotEmpty({
    message: 'Password value must not be empty. Please provide an password;.',
  })
  @IsString({ message: 'Password value must be a string.' })
  @Length(8, 128)
  public password: string;
}
