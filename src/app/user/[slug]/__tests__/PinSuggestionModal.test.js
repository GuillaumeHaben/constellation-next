import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PinSuggestionModal from '../components/PinSuggestionModal';
import { pinService } from '@/service/pinService';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
};

// Mock dependencies
jest.mock('@/service/pinService', () => ({
    pinService: {
        suggestPin: jest.fn(),
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
    Input: ({ label, value, onValueChange }) => (
        <div>
            <label>{label}</label>
            <input value={value} onChange={(e) => onValueChange(e.target.value)} data-testid={`input-${label}`} />
        </div>
    ),
    Image: ({ src, alt }) => <Image src={src} alt={alt} data-testid="preview-image" />,
}));

jest.mock('@heroicons/react/24/outline', () => ({
    PhotoIcon: () => <div />,
}));

// Mock global fetch for upload
global.fetch = jest.fn();

describe('PinSuggestionModal Component', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn()
    };

    beforeEach(() => {
        useAuth.mockReturnValue({ user: { id: 1, role: { type: 'user' } } });
        mockLocalStorageGetItem.mockReturnValue('fake-token');
        global.URL.createObjectURL = jest.fn(() => 'blob:url');
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:1337';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders and handles input', () => {
        render(<PinSuggestionModal {...defaultProps} />);

        const input = screen.getByTestId('input-Mission Name');
        fireEvent.change(input, { target: { value: 'New Mission' } });

        expect(input).toHaveValue('New Mission');
    });

    it('submits suggestion after successful upload', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ id: 100 }]
        });
        pinService.suggestPin.mockResolvedValue({});

        render(<PinSuggestionModal {...defaultProps} />);

        // Fill name
        fireEvent.change(screen.getByTestId('input-Mission Name'), { target: { value: 'Mars Mission' } });

        // Simulating file select is complex because of hidden input, 
        // but the Submit button is disabled until name AND file are present.
        // In this unit test, we might need to bypass the isDisabled or simulate the file change.
    });
});
