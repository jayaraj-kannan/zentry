import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../../components/Logo';

describe('Logo Component', () => {
  it('renders correctly with default props', () => {
    render(<Logo />);
    const logoElement = screen.getByText(/Zentry/i);
    expect(logoElement).toBeInTheDocument();
  });

  it('renders correctly in mini mode', () => {
    render(<Logo mini={true} />);
    const logoElement = screen.getByText(/Z/i);
    expect(logoElement).toBeInTheDocument();
  });
});
