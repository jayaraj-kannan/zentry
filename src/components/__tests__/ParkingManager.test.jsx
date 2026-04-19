import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ParkingManager from '../ParkingManager';

const mockParkingLots = [
  { id: 1, name: 'Lot A', occupancy: 90, distance: '100m', type: 'Public', entryGate: 'Gate A' },
  { id: 2, name: 'Lot B', occupancy: 40, distance: '50m', type: 'VIP', entryGate: 'Gate B' },
];

const mockZones = [
  { id: 1, name: 'Zone 1', density: 80 },
  { id: 2, name: 'Zone 2', density: 20 },
];

describe('ParkingManager', () => {
  it('renders "Your Vehicle" section when checked in and user lot is found', () => {
    render(<ParkingManager 
      parkingLots={mockParkingLots} 
      userParkingId={2} 
      isCheckedIn={true} 
      zones={mockZones}
      onNavigate={vi.fn()} 
    />);
    
    expect(screen.getByText('Your Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Parked in Lot B')).toBeInTheDocument();
  });

  it('calculates estimated exit time based on zone density', () => {
    // Average density = (80 + 20) / 2 = 50
    // Time = 8 + (50 / 5) = 18 mins
    render(<ParkingManager 
      parkingLots={mockParkingLots} 
      userParkingId={2} 
      isCheckedIn={true} 
      zones={mockZones}
      onNavigate={vi.fn()} 
    />);
    
    expect(screen.getByText('~18 mins')).toBeInTheDocument();
    expect(screen.getByText('Moderate Exit')).toBeInTheDocument();
  });

  it('renders AI Parking Assistant when not checked in', () => {
    render(<ParkingManager 
      parkingLots={mockParkingLots} 
      isCheckedIn={false} 
      onNavigate={vi.fn()} 
    />);
    
    expect(screen.getByText('AI Parking Assistant')).toBeInTheDocument();
    expect(screen.queryByText('Your Vehicle')).not.toBeInTheDocument();
  });

  it('renders list of all parking facilities', () => {
    render(<ParkingManager 
      parkingLots={mockParkingLots} 
      onNavigate={vi.fn()} 
    />);
    
    expect(screen.getByText('ALL PARKING FACILITIES')).toBeInTheDocument();
    expect(screen.getByText('Lot A')).toBeInTheDocument();
    expect(screen.getByText('Lot B')).toBeInTheDocument();
  });

  it('calls onNavigate with lot name when navigate button is clicked', () => {
    const onNavigate = vi.fn();
    render(<ParkingManager 
      parkingLots={mockParkingLots} 
      userParkingId={2} 
      isCheckedIn={true} 
      onNavigate={onNavigate} 
    />);
    
    const routeButton = screen.getByText('Route to My Vehicle');
    fireEvent.click(routeButton);
    
    expect(onNavigate).toHaveBeenCalledWith('Lot B');
  });
});
