import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { userService } from '@/service/userService';
import { createUserSlug } from '@/utils/slug';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/service/userService', () => ({
    userService: {
        update: jest.fn(),
    },
}));

jest.mock('@/utils/slug', () => ({
    createUserSlug: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />;
    },
}));

describe('Signup Component', () => {
    const mockLogin = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({ login: mockLogin });
        useRouter.mockReturnValue({ push: mockPush });
        createUserSlug.mockReturnValue('john-doe');
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders signup form correctly', () => {
        render(<Signup />);
        expect(screen.getByText('Create your account')).toBeInTheDocument();
        expect(screen.getByText(/Registration is restricted to/i)).toBeInTheDocument();
        expect(screen.getByLabelText('First name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Repeat password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    });

    it('updates input fields on change', async () => {
        const user = userEvent.setup();
        render(<Signup />);
        const firstNameInput = screen.getByLabelText('First name');
        const lastNameInput = screen.getByLabelText('Last name');
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        const repeatPasswordInput = screen.getByLabelText('Repeat password');

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john.doe@esa.int');
        await user.type(passwordInput, 'password123');
        await user.type(repeatPasswordInput, 'password123');

        expect(firstNameInput.value).toBe('John');
        expect(lastNameInput.value).toBe('Doe');
        expect(emailInput.value).toBe('john.doe@esa.int');
        expect(passwordInput.value).toBe('password123');
        expect(repeatPasswordInput.value).toBe('password123');
    });

    it('handles successful signup', async () => {
        const user = userEvent.setup();
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ jwt: 'fake-token', user: { id: 1, email: 'john.doe@esa.int' } }),
        });

        render(<Signup />);

        await user.type(screen.getByLabelText('First name'), 'John');
        await user.type(screen.getByLabelText('Last name'), 'Doe');
        await user.type(screen.getByLabelText('Email address'), 'john.doe@esa.int');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Repeat password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign up' }));

        await waitFor(() => {
            expect(createUserSlug).toHaveBeenCalledWith('John', 'Doe');
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/local/register'), expect.any(Object));
            expect(screen.getByText('Check your email')).toBeInTheDocument();
            expect(screen.getByText(/We've sent a confirmation link/i)).toBeInTheDocument();
            expect(mockLogin).not.toHaveBeenCalled();
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it('handles invalid email domain', async () => {
        const user = userEvent.setup();
        render(<Signup />);

        await user.type(screen.getByLabelText('Email address'), 'john.doe@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Repeat password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign up' }));

        await waitFor(() => {
            expect(screen.getByText(/Registration is restricted/i)).toBeInTheDocument();
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    it('handles failed signup from backend', async () => {
        const user = userEvent.setup();
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: { message: 'Registration failed' } }),
        });

        render(<Signup />);

        await user.type(screen.getByLabelText('First name'), 'John');
        await user.type(screen.getByLabelText('Last name'), 'Doe');
        await user.type(screen.getByLabelText('Email address'), 'john.doe@esa.int');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Repeat password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign up' }));

        await waitFor(() => {
            expect(screen.getByText('Registration failed')).toBeInTheDocument();
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    it('handles network error', async () => {
        const user = userEvent.setup();
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<Signup />);

        await user.type(screen.getByLabelText('First name'), 'John');
        await user.type(screen.getByLabelText('Last name'), 'Doe');
        await user.type(screen.getByLabelText('Email address'), 'john.doe@esa.int');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.type(screen.getByLabelText('Repeat password'), 'password123');

        await user.click(screen.getByRole('button', { name: 'Sign up' }));

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });
});
