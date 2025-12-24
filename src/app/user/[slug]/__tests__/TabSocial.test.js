import { render, screen } from '@testing-library/react';
import TabSocial from '../components/TabSocial';

// Mock heroui components
jest.mock('@heroui/react', () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardBody: ({ children }) => <div>{children}</div>,
    Tooltip: ({ children, content }) => <div title={content}>{children}</div>,
}));

describe('TabSocial Component', () => {
    const mockUserWithSocial = {
        linkedin: 'https://linkedin.com/in/john',
        instagram: 'https://instagram.com/john',
        github: 'https://github.com/john',
    };

    it('renders active social links', () => {
        render(<TabSocial targetUser={mockUserWithSocial} />);

        expect(screen.getByText('LinkedIn')).toBeInTheDocument();
        expect(screen.getByText('Instagram')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.queryByText('Twitter / X')).not.toBeInTheDocument();

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(3);
        expect(links[0].getAttribute('href')).toBe('https://linkedin.com/in/john');
    });

    it('renders empty state when no links are provided', () => {
        render(<TabSocial targetUser={{}} />);
        expect(screen.getByText('No social links available')).toBeInTheDocument();
    });
});
