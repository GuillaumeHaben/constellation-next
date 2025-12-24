import { render, screen } from '@testing-library/react';
import TabAwards from '../components/TabAwards';

describe('TabAwards Component', () => {
    it('renders coming soon message', () => {
        render(<TabAwards targetUser={{}} />);
        expect(screen.getByText(/Awards list coming soon/i)).toBeInTheDocument();
    });
});
