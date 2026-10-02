import { render, screen } from '@testing-library/react';
import StatusBadge from '../src/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders succeeded status correctly', () => {
    render(<StatusBadge status="succeeded" />);
    const badge = screen.getByText('succeeded');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-green-400');
  });

  it('renders failed status correctly', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByText('failed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-red-400');
  });

  it('renders running status correctly with pulse animation', () => {
    render(<StatusBadge status="running" />);
    const badge = screen.getByText('running');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('animate-pulse', 'text-blue-400');
  });
});
