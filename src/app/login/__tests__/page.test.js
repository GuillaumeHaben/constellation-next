import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />;
    },
}));

describe('Login Component', () => {
    const mockLogin = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({ login: mockLogin });
        useRouter.mockReturnValue({ push: mockPush });
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByText('Log in to your account')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('updates input fields on change', async () => {
        const user = userEvent.setup();
        render(<Login />);
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('handles successful login', async () => {
        const user = userEvent.setup();
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ jwt: 'fake-token', user: { id: 1, email: 'test@example.com' } }),
        });

        render(<Login />);

        await user.type(screen.getByLabelText('Email address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: 1, email: 'test@example.com' });
            expect(mockPush).toHaveBeenCalledWith('/home');
        });
    });

    it('handles failed login', async () => {
        const user = userEvent.setup();
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: { message: 'Invalid credentials' } }),
        });

        render(<Login />);

        await user.type(screen.getByLabelText('Email address'), 'wrong@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpass');

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    it('handles network error', async () => {
        const user = userEvent.setup();
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<Login />);

        await user.type(screen.getByLabelText('Email address'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign in' }));

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });
});
