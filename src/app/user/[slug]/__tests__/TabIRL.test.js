import { render, screen, waitFor } from '@testing-library/react';
import TabIRL from '../components/TabIRL';
import { userService } from '@/service/userService';
import React from 'react';

// Mock dependencies
jest.mock('@/service/userService', () => ({
    userService: {
        getEncountersCount: jest.fn(),
    },
}));

// Mock UI libraries
jest.mock('@heroui/react', () => ({
    Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
    CardBody: ({ children, className }) => <div data-testid="card-body" className={className}>{children}</div>,
}));

jest.mock('@heroicons/react/24/outline', () => ({
    UsersIcon: () => <span data-testid="users-icon">UsersIcon</span>,
    ChartBarIcon: () => <span data-testid="chart-icon">ChartBarIcon</span>,
    CalendarIcon: () => <span data-testid="calendar-icon">CalendarIcon</span>,
}));

describe('TabIRL Component', () => {
    const targetUser = { id: 1, slug: 'test-user', firstName: 'Test' };

    beforeEach(() => {
        userService.getEncountersCount.mockResolvedValue(5);

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'fake-token'),
            },
            writable: true,
        });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('renders encounter count and decorative elements', async () => {
        render(<TabIRL targetUser={targetUser} />);

        await waitFor(() => {
            expect(screen.getByText('IRL Connections')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Explorer')).toBeInTheDocument();
        });

        expect(userService.getEncountersCount).toHaveBeenCalledWith(targetUser.id, 'fake-token');
    });

    it('updates encounter count periodically', async () => {
        render(<TabIRL targetUser={targetUser} />);

        await waitFor(() => {
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        // Setup next value
        userService.getEncountersCount.mockResolvedValue(10);

        // Advance timers by 30 seconds
        jest.advanceTimersByTime(30000);

        await waitFor(() => {
            expect(screen.getByText('10')).toBeInTheDocument();
        });

        expect(userService.getEncountersCount).toHaveBeenCalledTimes(2);
    });

    it('handles error when fetching encounter count gracefully', async () => {
        console.error = jest.fn();
        userService.getEncountersCount.mockRejectedValue(new Error('Fetch failed'));

        render(<TabIRL targetUser={targetUser} />);

        // Should still show initial state or fallback (0)
        await waitFor(() => {
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        expect(console.error).toHaveBeenCalled();
    });

    it('renders coming soon placeholders', async () => {
        render(<TabIRL targetUser={targetUser} />);

        expect(screen.getByText('Last Connection')).toBeInTheDocument();
        expect(screen.getByText('Weekly Goal')).toBeInTheDocument();
        expect(screen.getByText('Activity Level')).toBeInTheDocument();
        expect(screen.getAllByText(/Coming soon/i)[0] || screen.getByText(/met/i)).toBeInTheDocument();
    });
});
