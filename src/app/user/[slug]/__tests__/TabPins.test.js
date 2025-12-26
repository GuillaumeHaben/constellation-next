import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TabPins from '../components/TabPins';
import { pinService } from '@/service/pinService';
import { useAuth } from '@/context/AuthContext';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
};

// Mock dependencies
jest.mock('@/service/pinService', () => ({
    pinService: {
        getUserPins: jest.fn(),
        unequipPin: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@heroui/react', () => ({
    Avatar: ({ src, name, color }) => <div data-testid="pin-avatar" data-color={color}>{name}</div>,
    Button: ({ children, onPress }) => <button onClick={onPress}>{children}</button>,
    Tooltip: ({ children, content }) => <div title={content}>{children}</div>,
    Chip: ({ children }) => <div>{children}</div>,
    Card: ({ children }) => <div>{children}</div>,
    CardBody: ({ children }) => <div>{children}</div>,
}));

jest.mock('@heroicons/react/24/solid', () => ({
    PlusIcon: () => <div />,
    LightBulbIcon: () => <div />,
    InformationCircleIcon: () => <div />,
    SparklesIcon: () => <div />,
}));

// Mock Modals
jest.mock('../components/PinLibraryModal', () => {
    const MockQuote = () => <div data-testid="library-modal" />;
    MockQuote.displayName = 'MockLibraryModal';
    return MockQuote;
});

jest.mock('../components/PinSuggestionModal', () => {
    const MockQuote = () => <div data-testid="suggestion-modal" />;
    MockQuote.displayName = 'MockSuggestionModal';
    return MockQuote;
});

jest.mock('../components/RarityInfoModal', () => {
    const MockQuote = () => <div data-testid="rarity-info-modal" />;
    MockQuote.displayName = 'MockRarityInfoModal';
    return MockQuote;
});

describe('TabPins Component', () => {
    const mockTargetUser = { id: 1, slug: 'target-user' };
    const mockPins = [
        { id: '1', name: 'Pin 1', rarity: '0.96', image: { url: '/pin1.png' } },
        { id: '2', name: 'Pin 2', rarity: '0.85', image: { url: '/pin2.png' } },
    ];

    beforeEach(() => {
        pinService.getUserPins.mockResolvedValue(mockPins);
        useAuth.mockReturnValue({ user: { slug: 'target-user', role: { name: 'Crew' } } });
        mockLocalStorageGetItem.mockReturnValue('fake-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders pins correctly', async () => {
        render(<TabPins targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByTitle('Pin 1')).toBeInTheDocument();
            expect(screen.getByTitle('Pin 2')).toBeInTheDocument();
        });

        expect(screen.getByText('✦ 1 Legendary')).toBeInTheDocument();
        expect(screen.getByText('◆ 1 Epic')).toBeInTheDocument();
    });

    it('shows action buttons for own profile with Crew role', async () => {
        render(<TabPins targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.getByText('Add Pin')).toBeInTheDocument();
            expect(screen.getByText('Suggest New Pin')).toBeInTheDocument();
        });
    });

    it('hides action buttons for other profiles', async () => {
        useAuth.mockReturnValue({ user: { slug: 'other-user', role: { name: 'Crew' } } });
        render(<TabPins targetUser={mockTargetUser} />);

        await waitFor(() => {
            expect(screen.queryByText('Add Pin')).not.toBeInTheDocument();
        });
    });

    it('handles unequip correctly', async () => {
        pinService.unequipPin.mockResolvedValue({});
        render(<TabPins targetUser={mockTargetUser} />);

        await waitFor(() => {
            const removeButton = screen.getAllByTitle('Remove Pin')[0];
            fireEvent.click(removeButton);
        });

        expect(pinService.unequipPin).toHaveBeenCalled();
    });
});
