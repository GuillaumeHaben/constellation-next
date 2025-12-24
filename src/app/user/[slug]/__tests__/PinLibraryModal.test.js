import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PinLibraryModal from '../components/PinLibraryModal';
import { pinService } from '@/service/pinService';
import { useAuth } from '@/context/AuthContext';

// Mock localStorage
beforeAll(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('fake-token');
});

// Mock dependencies
jest.mock('@/service/pinService', () => ({
    pinService: {
        getAllApproved: jest.fn(),
        equipPin: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Modal: ({ children, isOpen }) => isOpen ? <div>{children}</div> : null,
    ModalContent: ({ children }) => <div>{children}</div>,
    ModalHeader: ({ children }) => <div>{children}</div>,
    ModalBody: ({ children }) => <div>{children}</div>,
    ModalFooter: ({ children }) => <div>{children}</div>,
    Button: ({ children, onPress, isLoading, isDisabled }) => (
        <button onClick={onPress} disabled={isLoading || isDisabled}>{children}</button>
    ),
    Input: ({ placeholder, value, onValueChange }) => (
        <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            data-testid="search-input"
        />
    ),
    Avatar: ({ name, color }) => <div data-testid="pin-avatar" data-color={color}>{name}</div>,
}));

jest.mock('@heroicons/react/24/outline', () => ({
    MagnifyingGlassIcon: () => <div />,
}));

describe('PinLibraryModal Component', () => {
    const mockPins = [
        { id: '1', documentId: 'doc1', name: 'Apollo 11', rarity: '0.96' },
        { id: '2', documentId: 'doc2', name: 'James Webb', rarity: '0.85' },
    ];

    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        targetUser: { id: 1 },
        onPinAdded: jest.fn(),
        ownedPinIds: ['doc2']
    };

    beforeEach(() => {
        pinService.getAllApproved.mockResolvedValue(mockPins);
        useAuth.mockReturnValue({ user: { id: 1 } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders pins and handles search', async () => {
        render(<PinLibraryModal {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Apollo 11')).toBeInTheDocument();
            expect(screen.getByText('James Webb')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Apollo' } });

        expect(screen.getByText('Apollo 11')).toBeInTheDocument();
        expect(screen.queryByText('James Webb')).not.toBeInTheDocument();
    });

    it('shows "Owned" for pins already in collection', async () => {
        render(<PinLibraryModal {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Owned')).toBeInTheDocument();
            expect(screen.getByText('Add')).toBeInTheDocument();
        });
    });

    it('calls equipPin when "Add" is clicked', async () => {
        pinService.equipPin.mockResolvedValue({});
        render(<PinLibraryModal {...defaultProps} />);

        await waitFor(() => {
            const addButton = screen.getByText('Add');
            fireEvent.click(addButton);
        });

        expect(pinService.equipPin).toHaveBeenCalledWith('doc1', 1, 'fake-token');
        expect(defaultProps.onPinAdded).toHaveBeenCalled();
    });
});
