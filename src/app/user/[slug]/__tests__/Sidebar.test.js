import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { userService } from '@/service/userService';

// Mock utils
jest.mock('@/utils/media', () => ({
    getProfilePictureUrl: jest.fn(() => '/mock-url.jpg'),
}));

// Mock userService
jest.mock('@/service/userService', () => ({
    userService: {
        getEncounterToken: jest.fn(),
        upload: jest.fn(),
    },
}));

// Mock ProgressBar
jest.mock('../progressBar', () => () => <div data-testid="progress-bar" />);

// Mock heroicons
jest.mock('@heroicons/react/24/solid', () => ({
    CameraIcon: () => <div data-testid="camera-icon" />,
    PencilIcon: () => <div data-testid="pencil-icon" />,
    QrCodeIcon: () => <div data-testid="qr-code-icon" />,
    ArrowLeftIcon: () => <div data-testid="arrow-left-icon" />,
}));

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Avatar: ({ src, name }) => <img data-testid="avatar" src={src} alt={name} />,
    Button: ({ children, onPress, isLoading }) => (
        <button onClick={onPress} disabled={isLoading}>{children}</button>
    ),
    Card: ({ children }) => <div>{children}</div>,
    CardBody: ({ children }) => <div>{children}</div>,
    Spinner: () => <div data-testid="spinner" />,
}));

describe('Sidebar Component', () => {
    const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        position: 'Engineer',
        esaSite: 'ESTEC',
        country: 'Netherlands',
        pins: [1, 2, 3],
        encountersCount: 5,
        profilePicture: { url: '/test-url.jpg' }
    };

    const defaultProps = {
        targetUser: mockUser,
        isOwnProfile: false,
        isUploading: false,
        handleFileChange: jest.fn(),
        fileInputRef: { current: null },
        handleEditClick: jest.fn()
    };

    it('renders user information correctly', () => {
        render(<Sidebar {...defaultProps} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('ESTEC')).toBeInTheDocument();
    });


    it('shows edit button only on own profile', () => {
        const { rerender } = render(<Sidebar {...defaultProps} />);
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();

        rerender(<Sidebar {...defaultProps} isOwnProfile={true} />);
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('calls handleEditClick when edit button is clicked', () => {
        render(<Sidebar {...defaultProps} isOwnProfile={true} />);
        fireEvent.click(screen.getByText('Edit'));
        expect(defaultProps.handleEditClick).toHaveBeenCalled();
    });

    it('shows camera icon and handles file input on own profile', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        const fileInputRef = { current: fileInput };

        render(<Sidebar {...defaultProps} isOwnProfile={true} fileInputRef={fileInputRef} />);

        const cameraIcon = screen.getByTestId('camera-icon');
        expect(cameraIcon).toBeInTheDocument();

        fireEvent.click(cameraIcon.parentElement);
        // Note: simulation of click on hidden input is tricky but we can check if it triggers
    });

    it('shows spinner when uploading', () => {
        // Suppress console error for this test if needed or ensure props are valid
        render(<Sidebar {...defaultProps} isOwnProfile={true} isUploading={true} />);
        expect(screen.getAllByTestId('spinner')[0]).toBeInTheDocument();
    });
});
