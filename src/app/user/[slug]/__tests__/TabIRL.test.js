import { render, screen, waitFor } from '@testing-library/react';
import TabIRL from '../components/TabIRL';
import { userService } from '@/service/userService';
import { useAuth } from '@/context/AuthContext';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
};

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getEncountersCount: jest.fn(),
        getEncounteredUsers: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@heroui/react', () => ({
    Avatar: ({ src, name }) => <div data-testid="user-avatar">{name}</div>,
    Card: ({ children }) => <div>{children}</div>,
    CardBody: ({ children }) => <div>{children}</div>,
}));

jest.mock('@heroicons/react/24/outline', () => ({
    UsersIcon: () => <div />,
    ChartBarIcon: () => <div />,
    CalendarIcon: () => <div />,
}));

jest.mock('@/components/Quote', () => () => <div data-testid="quote" />);

describe('TabIRL Component', () => {
    const mockTargetUser = { id: 1, slug: 'target-user' };
    const mockEncounteredUsers = [
        { id: 2, firstName: 'Alice', lastName: 'Smith', slug: 'alice' },
        { id: 3, firstName: 'Bob', lastName: 'Jones', slug: 'bob' },
    ];

    // Mock localStorage
    beforeAll(() => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('fake-token');
    });

    beforeEach(() => {
        userService.getEncountersCount.mockResolvedValue(5);
        userService.getEncounteredUsers.mockResolvedValue(mockEncounteredUsers);
        useAuth.mockReturnValue({ user: { slug: 'target-user' } });
        // mockLocalStorageGetItem.mockReturnValue('fake-token'); // Removed
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders encounter count and users correctly', async () => {
        render(<TabIRL targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Alice Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Jones')).toBeInTheDocument();
        });
    });

    it('shows empty state for owner with no encounters', async () => {
        userService.getEncountersCount.mockResolvedValue(0);
        userService.getEncounteredUsers.mockResolvedValue([]);

        render(<TabIRL targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByText(/No IRL encounters recorded yet/i)).toBeInTheDocument();
        });
    });

    it('hides empty state for other profiles', async () => {
        useAuth.mockReturnValue({ user: { slug: 'other-user' } });
        userService.getEncountersCount.mockResolvedValue(0);
        userService.getEncounteredUsers.mockResolvedValue([]);

        render(<TabIRL targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.queryByText(/No IRL encounters recorded yet/i)).not.toBeInTheDocument();
        });
    });
});
