import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Styled Button</Button>);

    const button = screen.getByRole('button', { name: /styled button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);

    let button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);

    let button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button size="lg">Large Size</Button>);
    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should support asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
