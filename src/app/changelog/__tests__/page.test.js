
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Changelog from '../page';
import { changelogService } from '@/service/changelogService';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

// Mock dependencies
jest.mock('@/service/changelogService', () => ({
    changelogService: {
        getAll: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/components/Navbar', () => ({
    __esModule: true,
    default: () => <div data-testid="navbar">NavBar</div>,
}));

jest.mock('@/components/Header', () => ({
    __esModule: true,
    default: ({ title }) => <div data-testid="header">{title}</div>,
}));

jest.mock('@/components/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@/components/BreadCrumbs', () => ({
    __esModule: true,
    default: () => <div data-testid="breadcrumbs">BreadCrumbs</div>,
}));

jest.mock('../ModalCreateChangelog', () => ({
    __esModule: true,
    default: ({ isOpen, onClose, onSuccess }) => (
        isOpen ? (
            <div data-testid="modal-create-changelog">
                ModalCreateChangelog
                <button onClick={onClose}>Close</button>
                <button onClick={onSuccess}>Success</button>
            </div>
        ) : null
    ),
}));

// Mock UI libraries
jest.mock('@heroui/react', () => ({
    Button: ({ children, onPress, isIconOnly }) => (
        <button onClick={onPress} data-is-icon-only={isIconOnly ? "true" : "false"}>
            {children}
        </button>
    ),
}));

jest.mock('@heroicons/react/24/outline', () => ({
    ClockIcon: () => <span>ClockIcon</span>,
    PlusIcon: () => <span>PlusIcon</span>,
    TrashIcon: () => <span>TrashIcon</span>,
}));

describe('Changelog Page', () => {
    const mockChangelogs = [
        {
            documentId: 'doc1',
            version: '1.0.0',
            date: '2023-01-01',
            title: 'Initial Release',
            description: 'First version',
            tag: 'feature',
        },
        {
            documentId: 'doc2',
            version: '1.0.1',
            date: '2023-01-15',
            title: 'Bug Fixes',
            description: 'Fixed bugs',
            tag: 'bug-fix',
        },
    ];

    const mockAdminUser = {
        id: 1,
        role: { type: 'admin', name: 'Admin' },
    };

    const mockRegularUser = {
        id: 2,
        role: { type: 'authenticated', name: 'User' },
    };

    beforeEach(() => {
        changelogService.getAll.mockResolvedValue(mockChangelogs);
        changelogService.delete.mockResolvedValue(true);

        // Mock window.confirm
        global.confirm = jest.fn(() => true);

        // Mock scrollIntoView
        window.HTMLElement.prototype.scrollIntoView = jest.fn();

        // Mock localStorage
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

    it('renders changelog list for regular user', async () => {
        useAuth.mockReturnValue({ user: mockRegularUser });
        render(<Changelog />);

        await waitFor(() => {
            expect(changelogService.getAll).toHaveBeenCalled();
            expect(screen.getByText('v1.0.0 • January 1, 2023 at 1:00 AM')).toBeInTheDocument();
            expect(screen.getByText('Initial Release')).toBeInTheDocument();
            expect(screen.getByText('v1.0.1 • January 15, 2023 at 1:00 AM')).toBeInTheDocument();
            expect(screen.getByText('Bug Fixes')).toBeInTheDocument();
        });

        // Check that admin actions are NOT missing
        expect(screen.queryByText('PlusIcon')).not.toBeInTheDocument();
        expect(screen.queryByText('TrashIcon')).not.toBeInTheDocument();
    });

    it('shows create and delete options for admin user', async () => {
        useAuth.mockReturnValue({ user: mockAdminUser });
        render(<Changelog />);

        await waitFor(() => {
            expect(screen.getByText('Initial Release')).toBeInTheDocument();
        });

        // Plus icon for creating
        expect(screen.getByText('PlusIcon')).toBeInTheDocument();

        // Trash icons for deleting (2 items)
        const trashIcons = screen.getAllByText('TrashIcon');
        expect(trashIcons).toHaveLength(2);
    });

    it('opens create modal when plus button is clicked (admin)', async () => {
        useAuth.mockReturnValue({ user: mockAdminUser });
        const user = userEvent.setup();
        render(<Changelog />);

        await waitFor(() => {
            expect(screen.getByText('PlusIcon')).toBeInTheDocument();
        });

        await user.click(screen.getByText('PlusIcon'));

        expect(screen.getByTestId('modal-create-changelog')).toBeInTheDocument();
    });

    it('deletes a changelog entry when trash button is clicked (admin)', async () => {
        useAuth.mockReturnValue({ user: mockAdminUser });
        const user = userEvent.setup();
        render(<Changelog />);

        await waitFor(() => {
            expect(screen.getAllByText('TrashIcon')).toHaveLength(2);
        });

        // Click the first delete button (corresponding to doc1)
        const deleteButtons = screen.getAllByText('TrashIcon');
        await user.click(deleteButtons[0]);

        expect(global.confirm).toHaveBeenCalledWith("Are you sure you want to delete this changelog entry?");
        expect(changelogService.delete).toHaveBeenCalledWith('fake-token', 'doc1');

        // Should re-fetch after delete
        expect(changelogService.getAll).toHaveBeenCalledTimes(2); // Initial + reload
    });

    it('does not delete if confirm is cancelled', async () => {
        useAuth.mockReturnValue({ user: mockAdminUser });
        global.confirm.mockReturnValue(false);
        const user = userEvent.setup();
        render(<Changelog />);

        await waitFor(() => {
            expect(screen.getAllByText('TrashIcon')).toHaveLength(2);
        });

        await user.click(screen.getAllByText('TrashIcon')[0]);

        expect(global.confirm).toHaveBeenCalled();
        expect(changelogService.delete).not.toHaveBeenCalled();
    });
});
