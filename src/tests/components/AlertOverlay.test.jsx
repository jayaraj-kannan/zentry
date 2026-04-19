import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertOverlay from '../../components/AlertOverlay';

describe('AlertOverlay Component', () => {
  it('does not render when alert is null', () => {
    const { container } = render(<AlertOverlay alert={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when an alert is provided', () => {
    const alert = { message: 'Test Alert Message' };
    render(<AlertOverlay alert={alert} onClose={() => {}} />);
    expect(screen.getByText('Test Alert Message')).toBeInTheDocument();
    expect(screen.getByText('Smart Alert')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const alert = { message: 'Test Alert' };
    render(<AlertOverlay alert={alert} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // The component has a 300ms timeout before calling onClose
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(onClose).toHaveBeenCalled();
  });
});
