import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Informe um nome válido.' })
  @Length(3, 16, { message: 'O nome deve conter entre 3 a 16 caracteres.' })
  name: string;

  @IsString({ message: 'Informe um email' })
  @IsEmail()
  email: string;

  @IsString({ message: 'Informe uma senha válida.' })
  @Length(7, 20, { message: 'A senha deve conter entre 7 a 20 caracteres.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número ou caractere especial.',
  })
  password: string;
}
