// src/auth/controllers/auth.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
