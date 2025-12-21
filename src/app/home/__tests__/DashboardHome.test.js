import { render, screen, waitFor } from '@testing-library/react';
import DashboardHome from '../components/DashboardHome';
import { userService } from '@/service/userService';
import { pinService } from '@/service/pinService';
import React from 'react';

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getAll: jest.fn(),
    },
}));

jest.mock('@/service/pinService', () => ({
    pinService: {
        getAllApproved: jest.fn(),
    },
}));

jest.mock('@heroui/react', () => ({
    Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
    CardBody: ({ children, className }) => <div data-testid="card-body" className={className}>{children}</div>,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('DashboardHome Component', () => {
    const mockUsers = [
        { id: 1, firstName: 'Alice', lastName: 'A', country: 'France', esaSite: 'ESTEC', position: 'Staff', createdAt: new Date().toISOString() },
        { id: 2, firstName: 'Bob', lastName: 'B', country: 'France', esaSite: 'ESOC', position: 'YGT', createdAt: new Date().toISOString() },
        { id: 3, firstName: 'Carol', lastName: 'C', country: 'Germany', esaSite: 'ESTEC', position: 'Staff', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    const mockPins = [
        { id: 101, users: [{ id: 1 }, { id: 2 }] },
        { id: 102, users: [{ id: 1 }] },
    ];

    beforeEach(() => {
        userService.getAll.mockResolvedValue(mockUsers);
        pinService.getAllApproved.mockResolvedValue(mockPins);

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<DashboardHome />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('processes and displays community statistics', async () => {
        render(<DashboardHome />);

        await waitFor(() => {
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });

        // 3 Total users
        expect(screen.getByText('3')).toBeInTheDocument();
        // 2 New this week (Alice and Bob)
        expect(screen.getByText('2 new this week')).toBeInTheDocument();
        // Top Country: France
        expect(screen.getByText('France')).toBeInTheDocument();
        // Top Site: ESTEC
        expect(screen.getByText('ESTEC')).toBeInTheDocument();
        // Top Pin Collector: Alice (she has 2 pins, Bob has 1)
        expect(screen.getByText('Alice A')).toBeInTheDocument();
        expect(screen.getByText('2 pins collected')).toBeInTheDocument();
    });

    it('handles empty data gracefully', async () => {
        userService.getAll.mockResolvedValue([]);
        pinService.getAllApproved.mockResolvedValue([]);

        render(<DashboardHome />);

        await waitFor(() => {
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('None yet')).toBeInTheDocument();
    });
});
