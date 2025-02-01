// src/auth/dto/signin.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
