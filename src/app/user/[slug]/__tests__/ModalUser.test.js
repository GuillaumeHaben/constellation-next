import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalUser } from '../ModalUser';
import { userService } from '@/service/userService';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
};

// Mock userService
jest.mock('@/service/userService', () => ({
    userService: {
        update: jest.fn(),
    },
}));

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Modal: ({ children, isOpen }) => isOpen ? <div>{children}</div> : null,
    ModalContent: ({ children }) => <div>{children}</div>,
    ModalHeader: ({ children }) => <div>{children}</div>,
    ModalBody: ({ children }) => <div>{children}</div>,
    ModalFooter: ({ children }) => <div>{children}</div>,
    Button: ({ children, onPress, isLoading }) => (
        <button onClick={onPress} disabled={isLoading}>{children}</button>
    ),
    Input: ({ label, value, onChange }) => (
        <div>
            <label>{label}</label>
            <input value={value} onChange={onChange} data-testid={`input-${label}`} />
        </div>
    ),
    Select: ({ children, label, selectedKeys, onChange }) => (
        <div>
            <label>{label}</label>
            <select value={Array.from(selectedKeys)[0]} onChange={onChange} data-testid={`select-${label}`}>
                {children}
            </select>
        </div>
    ),
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
}));

describe('ModalUser Component', () => {
    const mockEditForm = {
        firstName: 'John',
        lastName: 'Doe',
        country: 'France',
        esaSite: 'ESTEC',
        directorate: 'TEC',
        position: 'Staff'
    };

    const defaultProps = {
        isOpen: true,
        setIsModalOpen: jest.fn(),
        editForm: mockEditForm,
        setEditForm: jest.fn(),
        targetUser: { id: 1 },
        setTargetUser: jest.fn()
    };

    // Mock localStorage
    beforeAll(() => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('fake-token');
    });

    beforeEach(() => {
        // mockLocalStorageGetItem.mockReturnValue('fake-token'); // Removed
    });

    it('renders with form data', () => {
        render(<ModalUser {...defaultProps} />);

        expect(screen.getByTestId('input-First Name')).toHaveValue('John');
        expect(screen.getByTestId('input-Last Name')).toHaveValue('Doe');
        expect(screen.getByTestId('select-Country of origin')).toHaveValue('France');
    });

    it('calls setEditForm when inputs change', () => {
        render(<ModalUser {...defaultProps} />);

        const firstNameInput = screen.getByTestId('input-First Name');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

        expect(defaultProps.setEditForm).toHaveBeenCalledWith({
            ...mockEditForm,
            firstName: 'Jane'
        });
    });

    it('handles save profile correctly', async () => {
        userService.update.mockResolvedValue({});
        render(<ModalUser {...defaultProps} />);

        const saveButton = screen.getByText('Save Changes');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(userService.update).toHaveBeenCalledWith(1, mockEditForm, 'fake-token');
            expect(defaultProps.setTargetUser).toHaveBeenCalledWith({ id: 1, ...mockEditForm });
            expect(defaultProps.setIsModalOpen).toHaveBeenCalledWith(false);
        });
    });

    it('handles cancel correctly', () => {
        render(<ModalUser {...defaultProps} />);

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(defaultProps.setIsModalOpen).toHaveBeenCalledWith(false);
    });
});
