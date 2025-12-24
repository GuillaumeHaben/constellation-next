import { render, screen } from '@testing-library/react';
import TabOverview from '../components/TabOverview';
import { useAuth } from '@/context/AuthContext';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
};

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
    GlobeAltIcon: () => <div data-testid="globe-icon" />,
    MapPinIcon: () => <div data-testid="map-pin-icon" />,
    BuildingOffice2Icon: () => <div data-testid="building-icon" />,
    BriefcaseIcon: () => <div data-testid="briefcase-icon" />,
    PhoneIcon: () => <div data-testid="phone-icon" />,
    HomeIcon: () => <div data-testid="home-icon" />,
    LockClosedIcon: () => <div data-testid="lock-icon" />,
    GlobeEuropeAfricaIcon: () => <div data-testid="globe-europe-icon" />,
}));

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Card: ({ children }) => <div>{children}</div>,
    CardBody: ({ children }) => <div>{children}</div>,
    Tooltip: ({ children, content }) => <div title={content}>{children}</div>,
}));

describe('TabOverview Component', () => {
    const mockTargetUser = {
        country: 'France',
        esaSite: 'HQ',
        directorate: 'D/TEC',
        position: 'Trainee',
        phoneNumber: '+33 1 23 45 67 89',
        address: '8-10 rue Mario Nikis, 75015 Paris',
        slug: 'target-user'
    };

    const mockCurrentUser = { slug: 'target-user' };

    beforeEach(() => {
        useAuth.mockReturnValue({ user: mockCurrentUser });
    });

    it('renders all tiles correctly for the owner', () => {
        render(<TabOverview targetUser={mockTargetUser} />);

        expect(screen.getByText('🇫🇷 France')).toBeInTheDocument();
        expect(screen.getByText('HQ')).toBeInTheDocument();
        expect(screen.getByText('D/TEC')).toBeInTheDocument();
        expect(screen.getByText('Trainee')).toBeInTheDocument();
        expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument();
        expect(screen.getByText('8-10 rue Mario Nikis, 75015 Paris')).toBeInTheDocument();
    });

    it('hides private information for other users', () => {
        useAuth.mockReturnValue({ user: { slug: 'other-user' } });
        render(<TabOverview targetUser={mockTargetUser} />);

        expect(screen.getByText('🇫🇷 France')).toBeInTheDocument();
        expect(screen.queryByText('+33 1 23 45 67 89')).not.toBeInTheDocument();
        expect(screen.queryByText('8-10 rue Mario Nikis, 75015 Paris')).not.toBeInTheDocument();
    });

    it('displays "Not specified" for missing fields', () => {
        const incompleteUser = { slug: 'target-user' };
        render(<TabOverview targetUser={incompleteUser} />);

        // Multiple "Not specified" because of multiple fields
        const placeholders = screen.getAllByText('Not specified');
        expect(placeholders.length).toBeGreaterThan(0);
    });
});
