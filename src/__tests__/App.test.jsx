import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock matchMedia for Lucide icons or other components that might use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.open
window.open = vi.fn();

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders initial home screen with welcome message', () => {
    render(<App />);
    expect(screen.getByText('Zentry')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Grand Finale!')).toBeInTheDocument();
    expect(screen.getByText('Check-In')).toBeInTheDocument();
  });

  it('toggles theme between dark and light', () => {
    render(<App />);
    const themeButton = screen.getAllByRole('button').find(b => 
        b.innerHTML.includes('svg') && !b.textContent
    );
    
    // Default is dark (component persists default state on mount)
    expect(localStorage.getItem('zentry-theme')).toBe('dark');
    
    fireEvent.click(themeButton);
    expect(localStorage.getItem('zentry-theme')).toBe('light');
    
    fireEvent.click(themeButton);
    expect(localStorage.getItem('zentry-theme')).toBe('dark');
  });

  it('completes the full check-in flow', async () => {
    vi.useFakeTimers();
    render(<App />);
    
    // 1. Click Check-In
    const checkInBtn = screen.getByText('Check-In');
    fireEvent.click(checkInBtn);
    
    expect(screen.getByText('TAP TO SHOW')).toBeInTheDocument();
    
    // 2. Tap to Show QR
    const qrSection = screen.getByText('TAP TO SHOW');
    fireEvent.click(qrSection);
    
    // scanning starts after 1.5s
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText('Scanning...')).toBeInTheDocument();
    
    // scanning finishes after 4s
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText('✓ VERIFIED')).toBeInTheDocument();
    expect(screen.getByText(/Verified successfully/)).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('manages SOS emergency state', async () => {
    vi.useFakeTimers();
    render(<App />);
    
    // 1. Click Check-In
    const checkInBtn = screen.getByText('Check-In');
    fireEvent.click(checkInBtn);
    
    // 2. Tap to Show QR (Need to be in scanned state for SOS to show)
    const qrSection = screen.getByText('TAP TO SHOW');
    fireEvent.click(qrSection);
    
    // Skip timers to scanned state (1.5s delay + 4s scan)
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    
    // Click SOS
    const sosBtn = screen.getByText('SOS');
    fireEvent.click(sosBtn);
    
    expect(screen.getByText('Emergency SOS')).toBeInTheDocument();
    
    // Trigger Medical SOS
    const medicalBtn = screen.getByText('Medical');
    fireEvent.click(medicalBtn);
    
    expect(screen.getByText(/SOS Received: Medical/)).toBeInTheDocument();
    
    // Dispatching finish after 4s
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    
    expect(screen.getByText(/Security Dispatched/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SECURITY DISPATCHED/i).length).toBeGreaterThanOrEqual(1);
    
    vi.useRealTimers();
  });

  it('triggers admin emergency protocol', () => {
    render(<App />);
    
    // Open settings/admin menu
    const settingsBtn = screen.getAllByRole('button').find(b => 
        b.innerHTML.includes('settings') || b.querySelector('[data-lucide="settings"]') || b.classList.contains('settings-trigger')
    );
    fireEvent.click(settingsBtn);
    
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    
    // Trigger Fire Evacuation
    const fireBtn = screen.getByText(/Trigger Fire Evacuation/);
    fireEvent.click(fireBtn);
    
    expect(screen.getAllByText(/EMERGENCY ALERT: Fire Evacuation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fire Evacuation/i).length).toBeGreaterThanOrEqual(1);
  });
});
