import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableUsers } from '../TableUsers';
import { userService } from '@/service/userService';

// Mock localStorage at top level
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getAll: jest.fn(),
        remove: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/components/DataTable', () => ({
    DataTable: ({ items, renderCell, topContent, bottomContent }) => (
        <div data-testid="data-table">
            {topContent}
            <table>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{renderCell(item, 'name')}</td>
                            <td>{renderCell(item, 'status')}</td>
                            <td>{renderCell(item, 'actions')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {bottomContent}
        </div>
    ),
    useDataTable: jest.fn((config) => {
        const [data, setData] = require('react').useState([]);
        const [filterValue, setFilterValue] = require('react').useState('');
        const [statusFilter, setStatusFilter] = require('react').useState('all');
        const [page, setPage] = require('react').useState(1);

        require('react').useEffect(() => {
            const fetchData = async () => {
                const result = await config.fetchData();
                const dataArray = Array.isArray(result) ? result : (result?.data || []);
                setData(dataArray);
            };
            fetchData();
        }, []);

        const filteredItems = config.customFilter
            ? config.customFilter(data, filterValue, statusFilter)
            : data;

        const sortedItems = config.customSort
            ? config.customSort(filteredItems, { column: 'name', direction: 'ascending' })
            : filteredItems;

        const items = sortedItems.slice(0, 5);

        return {
            data,
            setData,
            filterValue,
            selectedKeys: new Set([]),
            visibleColumns: new Set(config.initialVisibleColumns || []),
            statusFilter,
            sortDescriptor: { column: 'name', direction: 'ascending' },
            page,
            pages: 1,
            items,
            headerColumns: config.columns,
            filteredItems,
            setSelectedKeys: jest.fn(),
            setVisibleColumns: jest.fn(),
            setStatusFilter,
            setSortDescriptor: jest.fn(),
            setPage,
            onNextPage: jest.fn(),
            onPreviousPage: jest.fn(),
            onRowsPerPageChange: jest.fn(),
            onSearchChange: (value) => setFilterValue(value),
            onClear: () => setFilterValue(''),
            handleRemove: (removeFunc) => async (id) => {
                const token = mockLocalStorageGetItem('token');
                await removeFunc(id, token);
                setData((prev) => prev.filter((item) => item.id !== id));
            },
            hasSearchFilter: Boolean(filterValue),
        };
    }),
    TableTopContent: ({ filterValue, onSearchChange, onClear }) => (
        <div data-testid="table-top-content">
            <input
                data-testid="search-input"
                value={filterValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name..."
            />
            <button data-testid="clear-button" onClick={onClear}>Clear</button>
        </div>
    ),
    TableBottomContent: ({ page, pages }) => (
        <div data-testid="table-bottom-content">
            Page {page} of {pages}
        </div>
    ),
}));

jest.mock('../components/RenderCell', () => ({
    RenderCell: ({ user, columnKey, onRemove, canDelete }) => {
        if (columnKey === 'name') {
            return <span>{user.firstName} {user.lastName}</span>;
        }
        if (columnKey === 'status') {
            return <span>{user.blocked ? 'blocked' : 'active'}</span>;
        }
        if (columnKey === 'actions') {
            if (!canDelete) return null;
            return (
                <button data-testid={`delete-${user.id}`} onClick={() => onRemove(user.id)}>
                    Delete
                </button>
            );
        }
        return null;
    },
}));

describe('TableUsers Component', () => {
    const mockUsers = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            username: 'johndoe',
            blocked: false,
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            username: 'janesmith',
            blocked: true,
        },
        {
            id: 3,
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            username: 'bobjohnson',
            blocked: false,
        },
    ];

    beforeEach(() => {
        userService.getAll.mockResolvedValue(mockUsers);
        userService.remove.mockResolvedValue({});
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { role: { name: 'Admin' } }
        });
        mockLocalStorageGetItem.mockReturnValue('fake-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the table with users', async () => {
        render(<TableUsers />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        });
    });

    it('displays user status correctly', async () => {
        render(<TableUsers />);

        await waitFor(() => {
            const statuses = screen.getAllByText(/active|blocked/);
            expect(statuses).toHaveLength(3);
        });
    });

    it('filters users by search term', async () => {
        const user = userEvent.setup();
        render(<TableUsers />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'Jane');

        await waitFor(() => {
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

    it('clears search filter', async () => {
        const user = userEvent.setup();
        render(<TableUsers />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input');
        await user.type(searchInput, 'Jane');

        await waitFor(() => {
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });

        const clearButton = screen.getByTestId('clear-button');
        await user.click(clearButton);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    it('deletes a user when current user is Admin', async () => {
        const user = userEvent.setup();
        render(<TableUsers />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-1');
        await user.click(deleteButton);

        await waitFor(() => {
            expect(userService.remove).toHaveBeenCalledWith(1, 'fake-token');
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

    it('does not show delete button for non-Admin users', async () => {
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { role: { name: 'User' } }
        });

        render(<TableUsers />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('delete-1')).not.toBeInTheDocument();
    });
});
