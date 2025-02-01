// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  name: string;
}