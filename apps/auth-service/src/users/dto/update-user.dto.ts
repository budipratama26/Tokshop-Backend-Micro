import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Nama tidak boleh kosong jika diisi!',
  })
  @IsOptional()
  @MaxLength(100, {
    message: 'Nama maksimal 100 karakter!',
  })
  @Matches(/^[^<>]*$/, {
    message: 'Nama tidak boleh mengandung yang aneh!',
  })
  name?: string;
}