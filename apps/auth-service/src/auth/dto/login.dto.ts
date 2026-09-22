import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'format email tidak valid!',
    },
  )
  @MaxLength(255, {
    message: 'Email maksimal 255 karakter!',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password tidak boleh kosong!',
  })
  @MaxLength(72, {
    message: 'Password maksimal 72 karakter!',
  })
  password: string;
}
