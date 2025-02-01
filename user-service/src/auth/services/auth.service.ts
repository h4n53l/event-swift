// src/auth/services/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { EmailService } from '../../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
      role: 'guest',
      isVerified: false,
    });

    await this.userRepository.save(user);

    // Generate verification token
    const verificationToken = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '24h' },
    );

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Registration successful. Please check your email for verification.',
    };
  }

  async signin(signinDto: SigninDto) {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      
      const user = await this.userRepository.findOne({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.isVerified) {
        return { message: 'Email already verified' };
      }

      user.isVerified = true;
      await this.userRepository.save(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired verification token: ${error.message}`);
    }
  }
}
