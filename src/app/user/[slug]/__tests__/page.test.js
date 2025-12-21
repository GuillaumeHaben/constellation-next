import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import User from '../page';
import { userService } from '@/service/userService';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

// Mock React.use
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        use: (promise) => promise,
    };
});

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getBySlug: jest.fn(),
        upload: jest.fn(),
        update: jest.fn(),
        getEncounterToken: jest.fn(() => Promise.resolve({ token: 'fake-qr' })),
        getEncountersCount: jest.fn(() => Promise.resolve(0)),
        getUserById: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(() => ({
        user: {
            id: 1,
            slug: 'test-user',
            firstName: 'Test',
            lastName: 'User',
        }
    })),
}));

jest.mock('next/navigation', () => ({
    usePathname: () => '/user/test-user',
}));

jest.mock('@/components/Navbar', () => ({
    __esModule: true,
    default: () => <div data-testid="navbar">NavBar</div>,
}));

jest.mock('@/components/Header', () => ({
    __esModule: true,
    default: ({ title }) => <div data-testid="header">{title}</div>,
}));

jest.mock('@/components/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

// Mock UI libraries
jest.mock('@heroui/react', () => ({
    Avatar: () => <div data-testid="avatar">Avatar</div>,
    Button: ({ children, onPress }) => <button onClick={onPress}>{children}</button>,
    Card: ({ children }) => <div data-testid="card">{children}</div>,
    CardBody: ({ children }) => <div data-testid="card-body">{children}</div>,
    Spinner: () => <div data-testid="spinner">Spinner</div>,
    Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
    Tab: ({ children, title }) => <div data-testid="tab" title={title}>{children}</div>,
}));

jest.mock('@heroicons/react/24/solid', () => ({
    PencilIcon: () => <span data-testid="pencil-icon">PencilIcon</span>,
    CameraIcon: () => <span data-testid="camera-icon">CameraIcon</span>,
    QrCodeIcon: () => <span data-testid="qr-icon">QrCodeIcon</span>,
    ArrowLeftIcon: () => <span data-testid="back-icon">ArrowLeftIcon</span>,
}));

jest.mock('@heroicons/react/24/outline', () => ({
    UserIcon: () => <span>UserIcon</span>,
    TrophyIcon: () => <span>TrophyIcon</span>,
    EllipsisHorizontalCircleIcon: () => <span>EllipsisHorizontalCircleIcon</span>,
    UsersIcon: () => <span>UsersIcon</span>,
    QrCodeIcon: () => <span>QrCodeIcon</span>,
    ChatBubbleLeftRightIcon: () => <span>ChatBubbleLeftRightIcon</span>,
}));

jest.mock('@/components/Icons', () => ({
    InstagramIcon: () => <span>InstagramIcon</span>,
    LinkedInIcon: () => <span>LinkedInIcon</span>,
    FacebookIcon: () => <span>FacebookIcon</span>,
    GitHubIcon: () => <span>GitHubIcon</span>,
    TwitterIcon: () => <span>TwitterIcon</span>,
    WebsiteIcon: () => <span>WebsiteIcon</span>,
}));

jest.mock('../ModalUser', () => ({
    ModalUser: ({ isOpen }) => isOpen ? <div data-testid="modal-user">ModalUser</div> : null,
}));

jest.mock('../progressBar', () => ({
    __esModule: true,
    default: () => <div data-testid="progress-bar">ProgressBar</div>,
}));

jest.mock('@/utils/media', () => ({
    getProfilePictureUrl: () => 'http://example.com/pic.jpg',
}));

describe('User Profile Page', () => {
    const mockUser = {
        id: 1,
        slug: 'test-user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        position: 'Engineer',
        esaSite: 'ESTEC',
        country: 'France',
        birthday: '1990-01-01',
        linkedin: 'https://linkedin.com/in/test',
    };

    const mockCurrentUser = {
        id: 1,
        slug: 'test-user',
        firstName: 'Test',
        lastName: 'User',
    };

    beforeEach(() => {
        useAuth.mockReturnValue({ user: mockCurrentUser });
        userService.getBySlug.mockResolvedValue(mockUser);
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('does not show edit buttons for other profiles', async () => {
        useAuth.mockReturnValue({ user: { ...mockCurrentUser, slug: 'other-user' } });
        render(<User params={{ slug: 'test-user' }} />);

        await waitFor(() => {
            expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Pic/i)).not.toBeInTheDocument();
        });
    });
});
