import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AlertOverlay from '../AlertOverlay';

describe('AlertOverlay', () => {
  it('renders nothing when alert is null', () => {
    const { container } = render(<AlertOverlay alert={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders alert message when provided', () => {
    const alert = { message: 'Test Alert Message' };
    render(<AlertOverlay alert={alert} onClose={vi.fn()} />);
    
    expect(screen.getByText('Test Alert Message')).toBeInTheDocument();
  });

  it('renders Bell icon', () => {
    const alert = { message: 'Emergency!', persistent: true };
    const { container } = render(<AlertOverlay alert={alert} onClose={vi.fn()} />);
    
    // Check for Bell icon (lucide-bell class)
    expect(container.querySelector('.lucide-bell')).toBeInTheDocument();
  });

  it('calls onClose when close icon is clicked', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const alert = { message: 'Close me' };
    render(<AlertOverlay alert={alert} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // onClose is called inside a setTimeout(..., 300)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
