import { render, screen } from '@testing-library/react';
import Users from '../page';
import { useAuth } from '@/context/AuthContext';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../TableUsers', () => ({
    TableUsers: () => <div data-testid="table-users">TableUsers Component</div>,
}));

jest.mock('@/components/Navbar', () => ({
    __esModule: true,
    default: () => <div data-testid="navbar">NavBar</div>,
}));

jest.mock('@/components/BreadCrumbs', () => ({
    __esModule: true,
    default: () => <div data-testid="breadcrumbs">BreadCrumbs</div>,
}));

jest.mock('@/components/Header', () => ({
    __esModule: true,
    default: ({ title }) => <div data-testid="header">{title}</div>,
}));

jest.mock('@/components/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

describe('Users Page Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the page when user is authenticated', () => {
        useAuth.mockReturnValue({ user: { id: 1, email: 'test@example.com' } });

        render(<Users />);

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByTestId('table-users')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders nothing when user is not authenticated', () => {
        useAuth.mockReturnValue({ user: null });

        const { container } = render(<Users />);

        expect(container.firstChild).toBeNull();
    });

    it('has correct page structure', () => {
        useAuth.mockReturnValue({ user: { id: 1, email: 'test@example.com' } });

        render(<Users />);

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(mainElement).toHaveClass('flex-1');
    });
});
