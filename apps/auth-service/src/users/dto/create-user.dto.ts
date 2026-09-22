import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Nama gaboleh kosong!',
  })
  @MaxLength(100, {
    message: 'Nama maksimal 100 karakter!',
  })
  @Matches(/^[^<>]*$/, {
    message: 'Nama tidak boleh mengandung yang aneh!',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: ' format email gak valid!',
    },
  )
  @MaxLength(255, {
    message: 'Email maksimal 255 karakter!',
  })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'password minimal 8 karakter',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, dan 1 angka',
  })
  @MaxLength(72, {
    message: 'Password maksimal 72 karakter!',
  })
  password: string;
}
