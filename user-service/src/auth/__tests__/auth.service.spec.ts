// user-service/src/auth/__tests__/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../email/email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should create a new user and send verification email', async () => {
      const hashedPassword = 'hashedPassword';
      const token = 'verificationToken';
      
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);
      mockJwtService.sign.mockReturnValue(token);
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        ...signupDto,
        password: hashedPassword,
        role: 'guest',
        isVerified: false,
      });
      mockUserRepository.save.mockResolvedValue({
        id: '1',
        ...signupDto,
        password: hashedPassword,
        role: 'guest',
        isVerified: false,
      });

      const result = await service.signup(signupDto);

      expect(result.message).toBe('Registration successful. Please check your email for verification.');
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        signupDto.email,
        token
      );
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.signup(signupDto)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('signin', () => {
    const signinDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return token and user data on successful signin', async () => {
      const user = {
        id: '1',
        email: signinDto.email,
        password: await bcrypt.hash(signinDto.password, 10),
        name: 'Test User',
        role: 'guest',
        isVerified: true,
      };

      const token = 'jwt-token';

      mockUserRepository.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.signin(signinDto);

      expect(result).toEqual({
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is invalid', async () => {
      const user = {
        id: '1',
        email: signinDto.email,
        password: await bcrypt.hash('different-password', 10),
        isVerified: true,
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.signin(signinDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user is not verified', async () => {
      const user = {
        id: '1',
        email: signinDto.email,
        password: await bcrypt.hash(signinDto.password, 10),
        isVerified: false,
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.signin(signinDto)).rejects.toThrow('Please verify your email first');
    });
  });

  describe('verifyEmail', () => {
    it('should verify user email', async () => {
      const email = 'test@example.com';
      const token = 'valid-token';

      mockJwtService.verify.mockReturnValue({ email });
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.verifyEmail(token);

      expect(result.message).toBe('Email verified successfully');
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { email },
        { isVerified: true }
      );
    });

    it('should throw error for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow('Invalid token');
    });
  });
});