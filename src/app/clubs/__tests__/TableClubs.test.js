import { render, screen, waitFor } from '@testing-library/react';
import { TableClubs } from '../TableClubs';
import { clubService } from '@/service/clubService';

// Mock localStorage
const mockLocalStorageGetItem = jest.fn();
global.localStorage = {
    getItem: mockLocalStorageGetItem,
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock UI components
jest.mock('@heroui/react', () => ({
    Button: ({ children, onClick, onPress }) => <button onClick={onClick || onPress}>{children}</button>,
    Tooltip: ({ content, children }) => <div><span className="tooltip-content">{content}</span>{children}</div>,
    Input: () => <input />,
    Dropdown: ({ children }) => <div>{children}</div>,
    DropdownTrigger: ({ children }) => <div>{children}</div>,
    DropdownMenu: ({ children }) => <div>{children}</div>,
    DropdownItem: ({ children }) => <div>{children}</div>,
    DatePicker: ({ label, value, onChange }) => (
        <div data-testid="datepicker">
            <label>{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    ),
}));

jest.mock('@heroicons/react/24/solid', () => ({
    PencilSquareIcon: () => <span>EditIcon</span>,
    TrashIcon: () => <span>DeleteIcon</span>
}));

// Mock dependencies
jest.mock('@/service/clubService', () => ({
    clubService: {
        getAll: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../ModalClub', () => ({
    ModalClub: () => <div data-testid="modal-club">Modal Club</div>
}));

// Mock DataTable components
jest.mock('@/components/DataTable', () => ({
    DataTable: ({ items, renderCell, topContent, bottomContent }) => (
        <div data-testid="data-table">
            {topContent}
            <table>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{renderCell(item, 'name')}</td>
                            <td>{renderCell(item, 'owner')}</td>
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

        require('react').useEffect(() => {
            const fetchData = async () => {
                const result = await config.fetchData();
                setData(result || []);
            };
            fetchData();
        }, []);

        return {
            data,
            setData,
            items: data,
            headerColumns: config.columns,
            selectedKeys: new Set(),
            sortDescriptor: {},
            filterValue: "",
            visibleColumns: new Set(),
            page: 1,
            pages: 1,
            filteredItems: data,
            setSelectedKeys: jest.fn(),
            setSortDescriptor: jest.fn(),
            setPage: jest.fn(),
            setVisibleColumns: jest.fn(),
            onNextPage: jest.fn(),
            onPreviousPage: jest.fn(),
            onRowsPerPageChange: jest.fn(),
            onSearchChange: jest.fn(),
            onClear: jest.fn(),
            handleRemove: (fn) => (id) => fn(id),
        };
    }),
    TableTopContent: ({ children }) => <div data-testid="table-top-content">{children}</div>,
    TableBottomContent: () => <div data-testid="table-bottom-content" />,
}));

describe('TableClubs Component', () => {
    const mockClubs = [
        {
            id: 1,
            documentId: 'doc_1',
            name: 'My Club',
            description: 'My Description',
            owner: { id: 100, documentId: 'user_100', firstName: 'My', lastName: 'Owner' }
        },
        {
            id: 2,
            documentId: 'doc_2',
            name: 'Other Club',
            description: 'Other Description',
            owner: { id: 200, documentId: 'user_200', firstName: 'Other', lastName: 'Owner' }
        }
    ];

    beforeEach(() => {
        clubService.getAll.mockResolvedValue(mockClubs);
        mockLocalStorageGetItem.mockReturnValue('fake-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders "Create a club" button for Manager', async () => {
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { id: 100, documentId: 'user_100', role: { name: 'Manager' } }
        });

        render(<TableClubs />);

        await waitFor(() => {
            expect(screen.getByText('Create a club')).toBeInTheDocument();
            expect(screen.getByText('My Club')).toBeInTheDocument();
        });
    });

    it('does NOT render "Create a club" button for Crew', async () => {
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { id: 100, documentId: 'user_100', role: { name: 'Crew' } }
        });

        render(<TableClubs />);

        await waitFor(() => {
            expect(screen.queryByText('Create a club')).not.toBeInTheDocument();
            expect(screen.getByText('My Club')).toBeInTheDocument();
        });
    });

    it('Manager sees Edit/Delete ONLY for own clubs', async () => {
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { id: 100, documentId: 'user_100', role: { name: 'Manager' } }
        });

        render(<TableClubs />);

        await waitFor(() => {
            // Row 1 (My Club) should have EditIcon/DeleteIcon
            const row1 = screen.getByText('My Club').closest('tr');
            expect(row1).toHaveTextContent('EditIcon');
            expect(row1).toHaveTextContent('DeleteIcon');

            // Row 2 (Other Club) should NOT have icons
            const row2 = screen.getByText('Other Club').closest('tr');
            expect(row2).not.toHaveTextContent('EditIcon');
            expect(row2).not.toHaveTextContent('DeleteIcon');
        });
    });

    it('Admin sees Edit/Delete for ALL clubs', async () => {
        const { useAuth } = require('@/context/AuthContext');
        useAuth.mockReturnValue({
            user: { id: 999, role: { name: 'Admin' } }
        });

        render(<TableClubs />);

        await waitFor(() => {
            const row1 = screen.getByText('My Club').closest('tr');
            expect(row1).toHaveTextContent('EditIcon');

            const row2 = screen.getByText('Other Club').closest('tr');
            expect(row2).toHaveTextContent('EditIcon');
        });
    });
});
