import { render, screen, waitFor } from '@testing-library/react';
import User from '../page';
import { userService } from '@/service/userService';
import { useAuth } from '@/context/AuthContext';

// Mock localStorage
beforeAll(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('fake-token');
});

// Mock React.use
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    use: jest.fn(),
}));

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getBySlug: jest.fn(),
        upload: jest.fn(),
        update: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock child components
jest.mock('../components/Sidebar', () => {
    return function MockSidebar() { return <div data-testid="sidebar">Sidebar</div>; };
});
jest.mock('../components/MainContent', () => {
    return function MockMainContent() { return <div data-testid="main-content">MainContent</div>; };
});
jest.mock('../ModalUser', () => {
    return {
        ModalUser: function MockModalUser() { return <div data-testid="modal-user">ModalUser</div>; }
    };
});

// Mock layout components
jest.mock('@/components/Navbar', () => () => <div />);
jest.mock('@/components/Header', () => () => <div />);
jest.mock('@/components/Footer', () => () => <div />);
jest.mock('@/components/BreadCrumbs', () => () => <div />);

describe('User Profile Page', () => {
    const mockParams = { slug: 'john-doe' };
    const mockTargetUser = { id: 1, firstName: 'John', lastName: 'Doe', slug: 'john-doe' };
    const mockCurrentUser = { id: 1, slug: 'john-doe' };

    beforeEach(() => {
        const { use } = require('react');
        use.mockReturnValue(mockParams);
        useAuth.mockReturnValue({ user: mockCurrentUser });
        userService.getBySlug.mockResolvedValue(mockTargetUser);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and renders user data', async () => {
        render(<User params={Promise.resolve(mockParams)} />);

        await waitFor(() => {
            expect(userService.getBySlug).toHaveBeenCalledWith('john-doe', 'fake-token');
            expect(screen.getByTestId('sidebar')).toBeInTheDocument();
            expect(screen.getByTestId('main-content')).toBeInTheDocument();
        });
    });

    it('shows error message if user not found', async () => {
        userService.getBySlug.mockResolvedValue(null);
        render(<User params={Promise.resolve(mockParams)} />);

        await waitFor(() => {
            expect(screen.getByText('User profile not found.')).toBeInTheDocument();
        });
    });
});
