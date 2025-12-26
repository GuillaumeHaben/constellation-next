import { render, screen, waitFor } from '@testing-library/react';
import TabAwards from '../components/TabAwards';
import { awardService } from '@/service/awardService';


// Mock dependencies
jest.mock('@/service/awardService', () => ({
    awardService: {
        getAll: jest.fn(),
        getUserAwards: jest.fn(),
    },
}));

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Tooltip: ({ children, content }) => <div title="award-tooltip">{content}{children}</div>,
}));

// Mock HeroIcons
jest.mock('@heroicons/react/24/outline', () => ({
    __esModule: true,
    LockClosedIcon: () => <div data-testid="lock-icon" />,
    SparklesIcon: () => <div data-testid="sparkles-icon" />,
    UserGroupIcon: () => <div data-testid="user-group-icon" />,
    TicketIcon: () => <div data-testid="ticket-icon" />,
    QuestionMarkCircleIcon: () => <div data-testid="question-icon" />,
}));

describe('TabAwards Component', () => {
    const mockTargetUser = { id: 1, firstName: 'Test', lastName: 'User' };

    const mockAllAwards = [
        {
            id: 1,
            name: "Socialite",
            requirement: "Met more than 10 colleagues",
            category: "irl",
            iconName: "UserGroupIcon"
        },
        {
            id: 2,
            name: "Collector",
            requirement: "Collected more than 10 pins",
            category: "pin",
            iconName: "TicketIcon"
        }
    ];

    const mockUserAwards = [
        { id: 1, name: "Socialite" }
    ];

    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
        awardService.getAll.mockResolvedValue(mockAllAwards);
        awardService.getUserAwards.mockResolvedValue(mockUserAwards);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders award categories and individual awards', async () => {
        render(<TabAwards targetUser={mockTargetUser} />);

        await waitFor(() => {
            // CSS 'uppercase' doesn't change actual DOM text, so search case-insensitive
            expect(screen.getByText(/Socialite/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Collector/i)).toBeInTheDocument();
        expect(screen.getByText(/IRL awards/i)).toBeInTheDocument();
    });

    it('distinguishes between achieved and locked awards', async () => {
        render(<TabAwards targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByText(/Socialite/i)).toBeInTheDocument();
        });

        // Locked award (Collector) triggers LockClosedIcon in component logic
        const lockIcons = screen.getAllByTestId('lock-icon');
        expect(lockIcons.length).toBe(1);
    });

    it('shows empty state when no awards are available', async () => {
        awardService.getAll.mockResolvedValue([]);
        awardService.getUserAwards.mockResolvedValue([]);

        render(<TabAwards targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByText(/No awards found/i)).toBeInTheDocument();
        });
    });
});
