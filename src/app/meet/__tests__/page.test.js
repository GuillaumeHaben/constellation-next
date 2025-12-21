import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MeetPage from '../page';
import { userService } from '@/service/userService';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        validateEncounter: jest.fn(),
        getUserById: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Mock UI components
jest.mock('@/components/Navbar', () => ({
    __esModule: true,
    default: () => <div data-testid="navbar">NavBar</div>,
}));

jest.mock('@/components/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@heroui/react', () => ({
    Spinner: () => <div data-testid="spinner">Spinner</div>,
    Card: ({ children }) => <div data-testid="card">{children}</div>,
    CardBody: ({ children }) => <div data-testid="card-body">{children}</div>,
    Button: ({ children, onPress }) => <button onClick={onPress}>{children}</button>,
}));

describe('MeetPage Component', () => {
    const mockRouter = { push: jest.fn() };
    const mockSearchParams = { get: jest.fn() };
    const mockUser = { id: 1, slug: 'scanner-user' };

    beforeEach(() => {
        useRouter.mockReturnValue(mockRouter);
        useSearchParams.mockReturnValue(mockSearchParams);
        useAuth.mockReturnValue({ user: mockUser });

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => key === 'token' ? 'fake-jwt' : null),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('redirects to login if not authenticated', async () => {
        window.localStorage.getItem.mockReturnValue(null);
        render(<MeetPage />);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/login'));
        });
    });

    it('shows error if no token is provided', async () => {
        mockSearchParams.get.mockReturnValue(null);
        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Invalid meeting link. No token found.')).toBeInTheDocument();
        });
    });

    it('successfully validates token and shows success message', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({
            success: true,
            encounter: {
                userLow: { id: 1 },
                userHigh: { id: 10 }
            }
        });
        userService.getUserById.mockResolvedValue({ id: 10, slug: 'met-user', firstName: 'John' });

        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(screen.getByText('Encounter successfully recorded!')).toBeInTheDocument();
        });
    });

    it('shows error message if validation fails', async () => {
        mockSearchParams.get.mockReturnValue('invalid-token');
        userService.validateEncounter.mockRejectedValue(new Error('Token expired'));

        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Token expired')).toBeInTheDocument();
        });
    });

    it('handles already recorded encounter as success and uses otherUserId', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({
            success: true,
            alreadyRecorded: true,
            otherUserId: 22,
            encounter: { userLow: 1, userHigh: 22 },
        });
        userService.getUserById.mockResolvedValue({ id: 22, slug: 'alice', firstName: 'Alice' });

        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(screen.getByText("Encounter already recorded previously. You're connected!")).toBeInTheDocument();
        });
    });

    it('handles raw numeric IDs in encounter and resolves met user', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({
            success: true,
            encounter: { userLow: 1, userHigh: 33 },
        });
        userService.getUserById.mockResolvedValue({ id: 33, slug: 'bob', firstName: 'Bob' });

        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
        });
    });

    it('does not validate more than once (guarded)', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({ success: true, encounter: { userLow: { id: 1 }, userHigh: { id: 44 } } });
        userService.getUserById.mockResolvedValue({ id: 44, slug: 'carol', firstName: 'Carol' });

        const { rerender } = render(<MeetPage />);
        rerender(<MeetPage />);

        await waitFor(() => {
            expect(userService.validateEncounter).toHaveBeenCalledTimes(1);
        });
    });

    it('View Profile button navigates to met user profile when available', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({ success: true, encounter: { userLow: { id: 1 }, userHigh: { id: 55 } } });
        userService.getUserById.mockResolvedValue({ id: 55, slug: 'dave', firstName: 'Dave' });

        render(<MeetPage />);

        await waitFor(() => expect(screen.getByText('Success!')).toBeInTheDocument());

        fireEvent.click(screen.getByText('View Profile'));
        expect(mockRouter.push).toHaveBeenCalledWith('/user/dave');
    });

    it('falls back to /home when met user is unavailable', async () => {
        mockSearchParams.get.mockReturnValue('valid-meet-token');
        userService.validateEncounter.mockResolvedValue({ success: true, encounter: { userLow: { id: 1 }, userHigh: { id: 66 } } });
        userService.getUserById.mockResolvedValue(null);

        render(<MeetPage />);

        await waitFor(() => expect(screen.getByText('Success!')).toBeInTheDocument());

        fireEvent.click(screen.getByText('View Profile'));
        expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('shows default error message when error has no message', async () => {
        mockSearchParams.get.mockReturnValue('bad-token');
        userService.validateEncounter.mockRejectedValue({});

        render(<MeetPage />);

        await waitFor(() => {
            expect(screen.getByText('Failed to validate encounter. The QR code might be expired.')).toBeInTheDocument();
        });
    });

    it('renders loading state initially', async () => {
        mockSearchParams.get.mockReturnValue('loading-token');
        // Keep validate pending briefly
        userService.validateEncounter.mockImplementation(() => new Promise(() => { }));

        render(<MeetPage />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
});
