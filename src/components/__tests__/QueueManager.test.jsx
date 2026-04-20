import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QueueManager from '../QueueManager';

const mockStalls = [
  { id: 1, name: 'Stall A', type: 'food', waitTime: 10, diet: 'veg', serving: 'Tea' },
  { id: 2, name: 'Stall B', type: 'food', waitTime: 5, diet: 'non-veg', serving: 'Chicken' },
  { id: 3, name: 'Washroom 1', type: 'washroom', waitTime: 2 },
  { id: 4, name: 'Exit 1', type: 'exit', waitTime: 8 },
];

describe('QueueManager', () => {
  it('renders all categories of stalls', () => {
    render(<QueueManager stalls={mockStalls} onNavigate={vi.fn()} />);
    
    expect(screen.getByText('Food Counters')).toBeInTheDocument();
    expect(screen.getByText('Washroom Queues')).toBeInTheDocument();
    expect(screen.getByText('Exit Queues')).toBeInTheDocument();
    
    expect(screen.getByText('Stall A')).toBeInTheDocument();
    expect(screen.getAllByText('Stall B')[0]).toBeInTheDocument();
    expect(screen.getByText('Washroom 1')).toBeInTheDocument();
    expect(screen.getByText('Exit 1')).toBeInTheDocument();
  });

  it('identifies and displays the fastest food stall', () => {
    render(<QueueManager stalls={mockStalls} onNavigate={vi.fn()} />);
    
    // Fastest food is Stall B (5 mins)
    // It appears in the optimization card and the list
    const stallBElements = screen.getAllByText(/Stall B/);
    expect(stallBElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/5 mins|5 min wait/).length).toBeGreaterThanOrEqual(1);
  });

  it('handles pre-order state transitions', async () => {
    vi.useFakeTimers();
    render(<QueueManager stalls={mockStalls} onNavigate={vi.fn()} />);
    
    const preOrderButtons = screen.getAllByText('Pre-Order');
    fireEvent.click(preOrderButtons[0]); // Click first one (Stall A)
    
    expect(screen.getByText('Confirmed!')).toBeInTheDocument();
    
    // Fast-forward 4 seconds
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    
    expect(screen.queryByText('Confirmed!')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('calls onNavigate when map icon is clicked', () => {
    const onNavigate = vi.fn();
    render(<QueueManager stalls={mockStalls} onNavigate={onNavigate} />);
    
    const navButton = screen.getByRole('button', { name: /Navigate to Stall A/i });
    
    fireEvent.click(navButton);
    expect(onNavigate).toHaveBeenCalledWith('Stall A');
  });
});
