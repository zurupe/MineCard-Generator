import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardCanvas from '../components/CardCanvas';

describe('CardCanvas Component', () => {
    const defaultProps = {
        recipient: 'Player1',
        message: 'Hello World',
        backgroundColor: '#8b4513',
        textColor: '#ffffff',
    };

    it('renders recipient and message', () => {
        render(<CardCanvas {...defaultProps} />);
        expect(screen.getByText('Player1')).toBeInTheDocument();
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('applies background color correctly', () => {
        const { container } = render(<CardCanvas {...defaultProps} />);
        const canvas = container.querySelector('#minecard-canvas');
        expect(canvas).toHaveStyle({ backgroundColor: '#8b4513' });
    });

    it('renders skinElement when provided', () => {
        const SkinMock = () => <div data-testid="skin-mock">Skin</div>;
        render(<CardCanvas {...defaultProps} skinElement={<SkinMock />} />);
        expect(screen.getByTestId('skin-mock')).toBeInTheDocument();
    });
});
