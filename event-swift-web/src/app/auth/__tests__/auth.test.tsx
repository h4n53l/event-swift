import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpForm from '../signup/signup-form';
import SignInForm from '../signin/signin-form';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '../../../contexts/auth-provider';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('Authentication', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockReset();
  });

  describe('SignUp Form', () => {
    it('should render signup form', () => {
      render(
        <AuthProvider>
          <SignUpForm />
        </AuthProvider>
      );

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should handle successful signup', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Registration successful' })
      });

      render(
        <AuthProvider>
          <SignUpForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/name/i), {
        target: { value: 'Test User' }
      });

      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin?verified=pending');
      });
    });

    it('should handle signup error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Signup failed'));

      render(
        <AuthProvider>
          <SignUpForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('SignIn Form', () => {
    it('should render signin form', () => {
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      );

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should handle successful signin', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'guest'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'mock-token',
          user: mockUser
        })
      });

      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      });

      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle signin error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });
});