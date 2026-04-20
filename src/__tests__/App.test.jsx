import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock Context Hooks
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' },
    profileData: { role: 'admin', isCheckedIn: false },
    role: 'admin',
    logout: vi.fn(),
    updateProfileData: vi.fn()
  })
}));

vi.mock('../context/StadiumContext', () => ({
  useStadium: () => ({
    zones: [
      { id: 2, name: 'Gate 2 (Pavillion)', type: 'gate', density: 40, status: 'moderate', x: 740, y: 650, radius: 28 },
      { id: 19, name: 'Food Court', type: 'facility', density: 75, status: 'congested', x: 580, y: 250, radius: 35 }
    ],
    stalls: [
      { id: 101, name: 'Chai Kings', type: 'food', waitTime: 5, diet: 'veg', serving: 'Tea, Coffee' }
    ],
    parkingLots: [
      { id: 1, name: 'North Parking', occupancy: 40 }
    ],
    loading: false
  })
}));

// Mock Firebase status service
vi.mock('../firebase/stadiumService', () => ({
  seedInitialData: vi.fn(),
  simulateCrowdDynamics: vi.fn(),
  reportSosAlert: vi.fn().mockResolvedValue('alert-id')
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.open = vi.fn();

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders initial home screen with welcome message', () => {
    act(() => {
      render(<App />);
    });
    expect(screen.getByText(/Zentry/i)).toBeInTheDocument();
  });

  it('toggles theme between dark and light', () => {
    act(() => {
      render(<App />);
    });
    const themeButton = screen.getByRole('button', { name: /Switch to light mode/i });
    
    act(() => {
      fireEvent.click(themeButton);
    });
    expect(localStorage.getItem('zentry-theme')).toBe('light');
  });

  it('completes the full check-in flow', async () => {
    vi.useFakeTimers();
    act(() => {
      render(<App />);
    });
    
    const checkInBtn = screen.getAllByRole('button', { name: /Check-In/i }).find(
      btn => btn.textContent.trim() === 'Check-In'
    );
    
    act(() => {
      fireEvent.click(checkInBtn);
    });
    
    const qrSection = screen.getByText('TAP TO SHOW');
    act(() => {
      fireEvent.click(qrSection);
      vi.advanceTimersByTime(1600);
    });
    
    expect(screen.getByText('Scanning...')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(4100);
    });
    expect(screen.getByText('✓ VERIFIED')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('manages SOS emergency state', async () => {
    // 1. Setup
    vi.useFakeTimers();
    act(() => {
      render(<App />);
    });
    
    const checkInBtn = screen.getAllByRole('button', { name: /Check-In/i }).find(
      btn => btn.textContent.trim() === 'Check-In'
    );
    act(() => {
      fireEvent.click(checkInBtn);
    });
    
    const qrSection = screen.getByText('TAP TO SHOW');
    act(() => {
      fireEvent.click(qrSection);
      vi.advanceTimersByTime(6000);
    });

    // 2. Trigger SOS
    const sosBtn = screen.getByRole('button', { name: /Trigger Emergency SOS/i });
    act(() => {
      fireEvent.click(sosBtn);
    });
    
    const medicalBtn = screen.getByText(/Medical/i).closest('button');
    
    // We use vi.advanceTimersByTimeAsync to handle the promise logic in submitUserSOS
    await act(async () => {
      fireEvent.click(medicalBtn);
      // This flushes microtasks and any timers effectively
      await vi.advanceTimersByTimeAsync(0);
    });
    
    // Check for intermediate state
    expect(screen.getByText(/SOS TRANSMITTING/i)).toBeInTheDocument();
    
    // 3. Advance clock for the dispatch delay
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4100);
    });
    
    // The banner should now show SECURITY DISPATCHED (specific to the strong tag in the banner)
    expect(screen.getByText('SECURITY DISPATCHED', { selector: 'strong' })).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('triggers admin emergency protocol', () => {
    act(() => {
      render(<App />);
    });
    
    const settingsBtn = screen.getByRole('button', { name: /Open Account and Admin Settings/i });
    act(() => {
      fireEvent.click(settingsBtn);
    });
    
    const fireBtn = screen.getByText(/Trigger Fire Evacuation/i);
    act(() => {
      fireEvent.click(fireBtn);
    });
    
    expect(screen.getAllByText(/EMERGENCY ALERT: Fire Evacuation/i).length).toBeGreaterThanOrEqual(1);
  });
});
