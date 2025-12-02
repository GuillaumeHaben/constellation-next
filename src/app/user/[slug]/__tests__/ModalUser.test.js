import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalUser } from '../ModalUser';
import { userService } from '@/service/userService';

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        update: jest.fn(),
    },
}));

// Mock HeroUI components
jest.mock('@heroui/react', () => ({
    Modal: ({ children, isOpen }) => isOpen ? <div data-testid="modal">{children}</div> : null,
    ModalContent: ({ children }) => <div data-testid="modal-content">{children}</div>,
    ModalHeader: ({ children }) => <div data-testid="modal-header">{children}</div>,
    ModalBody: ({ children }) => <div data-testid="modal-body">{children}</div>,
    ModalFooter: ({ children }) => <div data-testid="modal-footer">{children}</div>,
    Button: ({ children, onPress, color }) => (
        <button onClick={onPress} data-testid={`button-${color}`}>
            {children}
        </button>
    ),
    Input: ({ label, value, onChange, placeholder }) => (
        <div data-testid={`input-${label}`}>
            <label>{label}</label>
            <input
                value={value || ''}
                onChange={onChange}
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
        <option value={value}>{children}</option>
    ),
}));

describe('ModalUser Component', () => {
    const mockUser = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
    };

    const mockEditForm = {
        firstName: 'Test',
        lastName: 'User',
        country: 'France',
    };

    const mockSetEditForm = jest.fn();
    const mockSetTargetUser = jest.fn();
    const mockSetIsModalOpen = jest.fn();

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when closed', () => {
        render(
            <ModalUser
                isOpen={false}
                setIsModalOpen={mockSetIsModalOpen}
                editForm={mockEditForm}
                setEditForm={mockSetEditForm}
                targetUser={mockUser}
                setTargetUser={mockSetTargetUser}
            />
        );

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders form fields when open', () => {
        render(
            <ModalUser
                isOpen={true}
                setIsModalOpen={mockSetIsModalOpen}
                editForm={mockEditForm}
                setEditForm={mockSetEditForm}
                targetUser={mockUser}
                setTargetUser={mockSetTargetUser}
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Country of origin')).toBeInTheDocument();
    });

    it('updates form state on input change', async () => {
        const user = userEvent.setup();
        render(
            <ModalUser
                isOpen={true}
                setIsModalOpen={mockSetIsModalOpen}
                editForm={mockEditForm}
                setEditForm={mockSetEditForm}
                targetUser={mockUser}
                setTargetUser={mockSetTargetUser}
            />
        );

        const firstNameInput = screen.getByLabelText('First Name');
        await user.type(firstNameInput, 'Updated');

        // Since we mocked Input to call onChange with the event, and the component uses e.target.value
        // The mock implementation needs to be correct.
        // However, userEvent.type calls onChange multiple times.
        // Let's verify that setEditForm was called.
        expect(mockSetEditForm).toHaveBeenCalled();
    });

    it('saves profile changes', async () => {
        const user = userEvent.setup();
        userService.update.mockResolvedValue({});

        render(
            <ModalUser
                isOpen={true}
                setIsModalOpen={mockSetIsModalOpen}
                editForm={mockEditForm}
                setEditForm={mockSetEditForm}
                targetUser={mockUser}
                setTargetUser={mockSetTargetUser}
            />
        );

        const saveButton = screen.getByTestId('button-primary');
        await user.click(saveButton);

        await waitFor(() => {
            expect(userService.update).toHaveBeenCalledWith(1, mockEditForm, 'fake-token');
            expect(mockSetTargetUser).toHaveBeenCalled();
            expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
        });
    });

    it('closes modal on cancel', async () => {
        const user = userEvent.setup();
        render(
            <ModalUser
                isOpen={true}
                setIsModalOpen={mockSetIsModalOpen}
                editForm={mockEditForm}
                setEditForm={mockSetEditForm}
                targetUser={mockUser}
                setTargetUser={mockSetTargetUser}
            />
        );

        const cancelButton = screen.getByTestId('button-danger');
        await user.click(cancelButton);

        expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
});
