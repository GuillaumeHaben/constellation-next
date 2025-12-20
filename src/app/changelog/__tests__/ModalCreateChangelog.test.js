import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalCreateChangelog from '../ModalCreateChangelog';
import { changelogService } from '@/service/changelogService';

// Mock dependencies
jest.mock('@/service/changelogService', () => ({
    changelogService: {
        getLatest: jest.fn(),
        create: jest.fn(),
    },
}));

// Mock HeroUI components (simplified for testing logic)
jest.mock('@heroui/react', () => ({
    Modal: ({ children, isOpen }) => isOpen ? <div data-testid="modal">{children}</div> : null,
    ModalContent: ({ children }) => <div data-testid="modal-content">{children(() => { })}</div>, // Mocking the function child pattern
    ModalHeader: ({ children }) => <div data-testid="modal-header">{children}</div>,
    ModalBody: ({ children }) => <div data-testid="modal-body">{children}</div>,
    ModalFooter: ({ children }) => <div data-testid="modal-footer">{children}</div>,
    Button: ({ children, onPress, color }) => (
        <button onClick={onPress} data-testid={`button-${color}`}>
            {children}
        </button>
    ),
    Input: ({ label, value, onValueChange, placeholder }) => (
        <div data-testid={`input-${label}`}>
            <label>{label}</label>
            <input
                value={value || ''}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                aria-label={label}
            />
        </div>
    ),
    Select: ({ label, children, onChange, selectedKeys }) => (
        <div data-testid={`select-${label}`}>
            <label>{label}</label>
            <select
                onChange={onChange}
                value={selectedKeys ? selectedKeys[0] : ''}
                aria-label={label}
            >
                {children}
            </select>
        </div>
    ),
    SelectItem: ({ children, value }) => (
        <option value={value} key={value}>{children}</option>
    ),
    Textarea: ({ label, value, onValueChange, placeholder }) => (
        <div data-testid={`textarea-${label}`}>
            <label>{label}</label>
            <textarea
                value={value || ''}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={placeholder}
                aria-label={label}
            />
        </div>
    ),
}));

describe('ModalCreateChangelog Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
            },
            writable: true,
        });
        jest.clearAllMocks();
    });

    it('fetches latest version and calculates next (Minor) by default', async () => {
        changelogService.getLatest.mockResolvedValue({ version: '1.0.0' });

        render(
            <ModalCreateChangelog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        // Wait for the UI to update with the fetched data
        await waitFor(() => {
            expect(screen.getByText('1.1.0')).toBeInTheDocument();
        });

        expect(screen.getByText('New Version:')).toBeInTheDocument();
        expect(screen.getByText('Latest Version:')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });

    it('defaults to 0.1.0 if no latest version exists', async () => {
        changelogService.getLatest.mockResolvedValue(null);

        render(
            <ModalCreateChangelog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            expect(screen.getAllByText('0.1.0').length).toBeGreaterThan(0);
        });
    });

    it('updates next version when increment type changes', async () => {
        const user = userEvent.setup();
        changelogService.getLatest.mockResolvedValue({ version: '1.2.3' });

        render(
            <ModalCreateChangelog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => expect(screen.getAllByText('1.3.0')[0]).toBeInTheDocument()); // Default minor

        // Change to Major
        const select = screen.getByLabelText('Increment Type');
        await user.selectOptions(select, 'major');

        expect(screen.getByText('2.0.0')).toBeInTheDocument();

        // Change to Patch
        await user.selectOptions(select, 'patch');
        expect(screen.getByText('1.2.4')).toBeInTheDocument();
    });

    it('submits correctly with calculated version', async () => {
        const user = userEvent.setup();
        changelogService.getLatest.mockResolvedValue({ version: '0.5.0' });
        changelogService.create.mockResolvedValue({});

        render(
            <ModalCreateChangelog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => expect(screen.getAllByText('0.6.0')[0]).toBeInTheDocument()); // Default minor

        // Fill form
        await user.type(screen.getByLabelText('Title'), 'New Feature');
        await user.type(screen.getByLabelText('Description'), 'Cool stuff');

        // Submit
        const createBtn = screen.getByTestId('button-primary');
        await user.click(createBtn);

        await waitFor(() => {
            expect(changelogService.create).toHaveBeenCalledWith('fake-token', expect.objectContaining({
                version: '0.6.0',
                title: 'New Feature',
                description: 'Cool stuff',
                tag: 'feature'
            }));
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    it('handles malformed version strings gracefully', async () => {
        changelogService.getLatest.mockResolvedValue({ version: 'invalid-version' });

        render(
            <ModalCreateChangelog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        await waitFor(() => {
            // It appears in both Latest Version and New Version spots
            const elements = screen.getAllByText('invalid-version');
            expect(elements.length).toBeGreaterThanOrEqual(1);
        });
    });
});
