# Testing Guide for F-Career Client

This document provides a comprehensive guide for writing, running, and maintaining tests in the F-Career client application.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)
- [Testing Patterns](#testing-patterns)
- [Best Practices](#best-practices)
- [Mocking Guidelines](#mocking-guidelines)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Testing Stack

Our testing setup consists of:

- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - React component testing utilities
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Custom Jest matchers for DOM assertions
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - User interaction simulation
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** - TypeScript support for Jest

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>=18)
- pnpm

### Installation

The testing dependencies are already configured. If you need to reinstall them:

```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest @types/jest
```

### Configuration Files

- **`jest.config.js`** - Main Jest configuration
- **`jest.setup.js`** - Global test setup and mocks
- **`src/utils/test-utils.tsx`** - Custom testing utilities and helpers

## Running Tests

### Basic Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run tests for CI (non-interactive)
pnpm test:ci

# Debug tests with detailed output
pnpm test:debug
```

### Running Specific Tests

```bash
# Run tests for a specific file
pnpm test button.test.tsx

# Run tests matching a pattern
pnpm test auth

# Run tests with specific test name pattern
pnpm test --testNamePattern="should login"

# Run tests in a specific directory
pnpm test src/components/ui
```

### Watch Mode Options

When running `pnpm test:watch`, you can use these interactive options:

- **`a`** - Run all tests
- **`f`** - Run only failed tests
- **`o`** - Run only tests related to changed files
- **`p`** - Filter by filename pattern
- **`t`** - Filter by test name pattern
- **`q`** - Quit watch mode

## Project Structure

```
src/
├── components/
│   └── __tests__/           # Component tests
│       ├── ui/
│       └── job-search/
├── services/
│   └── api/
│       └── __tests__/       # API service tests
├── utils/
│   ├── __tests__/           # Utility function tests
│   └── test-utils.tsx       # Custom testing utilities
└── hooks/
    └── __tests__/           # Custom hook tests
```

### Naming Conventions

- Test files: `*.test.tsx` or `*.test.ts`
- Test directories: `__tests__/`
- Mock files: `*.mock.ts` or place in `__mocks__/` directory

## Writing Tests

### Basic Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<MyComponent onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Components with Redux

```typescript
import { renderWithProviders, createMockUser } from '@/utils/test-utils'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  it('should display user information from Redux state', () => {
    const initialState = {
      auth: {
        user: createMockUser({ fullName: 'John Doe' }),
        isAuthenticated: true,
      },
    }

    renderWithProviders(<UserProfile />, { preloadedState: initialState })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### Testing API Services

```typescript
import axios from 'axios';
import { authApi } from './auth-api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockResponse = { data: { token: 'jwt-token' } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await authApi.login('user@example.com', 'password');

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@example.com',
      password: 'password',
    });
    expect(result).toEqual(mockResponse.data);
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Testing Utility Functions

```typescript
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should handle edge cases', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
});
```

## Testing Patterns

### Arrange-Act-Assert (AAA) Pattern

```typescript
it('should update user profile', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockUpdateProfile = jest.fn()
  render(<ProfileForm onUpdate={mockUpdateProfile} />)

  // Act
  await user.type(screen.getByLabelText(/full name/i), 'John Doe')
  await user.click(screen.getByRole('button', { name: /save/i }))

  // Assert
  expect(mockUpdateProfile).toHaveBeenCalledWith({ fullName: 'John Doe' })
})
```

### Page Object Pattern (for complex components)

```typescript
class JobCardPageObject {
  constructor(private container: HTMLElement) {}

  get title() {
    return this.container.querySelector('[data-testid="job-title"]')?.textContent
  }

  get applyButton() {
    return this.container.querySelector('[data-testid="apply-button"]') as HTMLButtonElement
  }

  async clickApply() {
    const user = userEvent.setup()
    await user.click(this.applyButton)
  }
}

describe('JobCard', () => {
  it('should apply to job', async () => {
    const { container } = render(<JobCard job={mockJob} />)
    const jobCard = new JobCardPageObject(container)

    await jobCard.clickApply()
    // assertions...
  })
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Don't test implementation details:**

```typescript
// Bad - testing internal state
expect(wrapper.state('isLoading')).toBe(false);
```

✅ **Do test user-visible behavior:**

```typescript
// Good - testing what the user sees
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
```

### 2. Use Semantic Queries

Prefer queries in this order:

1. `getByRole` - Most accessible
2. `getByLabelText` - For form elements
3. `getByText` - For non-interactive elements
4. `getByTestId` - Last resort

```typescript
// ✅ Good
const button = screen.getByRole('button', { name: /submit/i });
const input = screen.getByLabelText(/email address/i);

// ❌ Avoid
const button = screen.getByTestId('submit-button');
```

### 3. Test Error Boundaries

```typescript
it('should handle errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### 4. Test Loading States

```typescript
it('should show loading state while fetching data', async () => {
  render(<JobList />)

  // Loading state should be visible initially
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
```

### 5. Group Related Tests

```typescript
describe('JobCard', () => {
  describe('when user is authenticated', () => {
    it('should show apply button', () => {
      // test implementation
    });
  });

  describe('when user is not authenticated', () => {
    it('should show login prompt', () => {
      // test implementation
    });
  });
});
```

## Mocking Guidelines

### Mocking External Dependencies

```typescript
// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test',
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
```

### Mocking React Components

```typescript
// Mock heavy components
jest.mock('@/components/charts/ComplexChart', () => ({
  ComplexChart: () => <div data-testid="mock-chart">Chart</div>
}))

// Mock with props
jest.mock('@/components/Modal', () => ({
  Modal: ({ children, isOpen }: any) =>
    isOpen ? <div data-testid="modal">{children}</div> : null
}))
```

### Mocking Custom Hooks

```typescript
jest.mock('@/hooks/useJobData', () => ({
  useJobData: () => ({
    jobs: mockJobs,
    loading: false,
    error: null,
  }),
}));
```

## Coverage Reports

### Viewing Coverage

```bash
# Generate and view coverage report
pnpm test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Current thresholds (configured in `jest.config.js`):

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Ignoring Files from Coverage

Add comments to exclude specific code:

```typescript
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:ci
      - uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

Tests are automatically run via lint-staged:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "pnpm test --findRelatedTests --bail"
    ]
  }
}
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

```bash
# Clear Jest cache
pnpm test --clearCache

# Check module resolution
pnpm test --debug-resolve
```

#### 2. Async tests timing out

```typescript
// Increase timeout for specific tests
it('should handle long operation', async () => {
  // test implementation
}, 10000); // 10 second timeout

// Or use waitFor with custom timeout
await waitFor(
  () => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  },
  { timeout: 5000 },
);
```

#### 3. Act warnings

```typescript
// Wrap state updates in act()
await act(async () => {
  result.current.updateData(newData);
});

// Or use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

#### 4. Mock not working

```typescript
// Ensure mocks are called before imports
jest.mock('./module');
import { Component } from './component'; // This import sees the mock

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Debug Mode

```bash
# Run tests with debug output
pnpm test:debug

# Run single test file with debug
pnpm test --runInBand --no-cache button.test.tsx
```

### Performance Issues

```bash
# Run tests with performance profiling
pnpm test --logHeapUsage

# Run tests in band (single process)
pnpm test --runInBand

# Increase worker pool size
pnpm test --maxWorkers=4
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom#custom-matchers)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new tests:

1. Follow the existing patterns and conventions
2. Ensure good test coverage for new features
3. Update this documentation if you add new testing utilities
4. Consider the maintainability of your test code
5. Write descriptive test names that explain the expected behavior

Happy testing! 🧪
