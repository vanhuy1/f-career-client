# Error Boundary System

This documentation covers the comprehensive error boundary system implemented for the application.

## Overview

The error boundary system provides:

- **Global error catching** at the application level
- **Reusable error boundary components** for specific sections
- **Customizable fallback UI components**
- **Development testing utilities**
- **User-friendly error displays** with recovery options

## Components

### 1. ErrorBoundary (Main Component)

A class-based React error boundary that catches JavaScript errors anywhere in the component tree.

```tsx
import { ErrorBoundary } from '@/components/common';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom error handler
<ErrorBoundary onError={(error, errorInfo) => {
  // Custom logging or reporting
  logToService(error, errorInfo);
}}>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

#### Props

- `children`: ReactNode - Components to wrap
- `fallback?`: ReactNode - Custom fallback UI
- `onError?`: (error: Error, errorInfo: ErrorInfo) => void - Custom error handler

### 2. ErrorFallback (Fallback UI Components)

Reusable error display components with different sizes and configurations.

```tsx
import { ErrorFallback, ErrorFallbackCompact } from '@/components/common';

// Standard fallback
<ErrorFallback
  title="Custom Error Title"
  message="Custom error message"
  resetError={() => {
    // Handle retry logic
  }}
  size="lg"
  showHomeButton={true}
  showReloadButton={true}
/>

// Compact version for smaller spaces
<ErrorFallbackCompact
  title="Error"
  message="Something went wrong"
  resetError={() => handleRetry()}
/>
```

#### Props

- `error?`: Error - The error object (optional)
- `resetError?`: () => void - Function to retry/reset
- `title?`: string - Custom title (default: "Something went wrong")
- `message?`: string - Custom message
- `showHomeButton?`: boolean - Show home navigation (default: true)
- `showReloadButton?`: boolean - Show reload button (default: true)
- `size?`: 'sm' | 'md' | 'lg' - Size variant (default: 'md')
- `className?`: string - Additional CSS classes

### 3. ErrorBoundaryTest (Development Testing)

Testing utilities for development environment only.

```tsx
import {
  ErrorBoundaryTest,
  useErrorBoundaryTest,
  withErrorBoundaryTest,
} from '@/components/common';

// Component for manual testing (only shows in development)
<ErrorBoundaryTest />;

// Hook for programmatic testing
const MyComponent = () => {
  const { throwError } = useErrorBoundaryTest();

  return (
    <button onClick={() => throwError('Test error message')}>
      Trigger Error
    </button>
  );
};

// HOC to add testing UI to any component
const ComponentWithTesting = withErrorBoundaryTest(MyComponent);
```

## Implementation

### Global Setup

The error boundary is already integrated into the `MainProvider` to catch application-wide errors:

```tsx
// src/providers/MainProvider.tsx
<ErrorBoundary onError={handleGlobalError}>
  {/* All your app providers and components */}
</ErrorBoundary>
```

### Page-Level Error Boundaries

For specific pages or sections:

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components/common';

const MyPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Page Error"
          message="Failed to load this page. Please try again."
          size="lg"
        />
      }
    >
      <PageContent />
    </ErrorBoundary>
  );
};
```

### Component-Level Error Boundaries

For critical components:

```tsx
import { ErrorBoundary, ErrorFallbackCompact } from '@/components/common';

const CriticalComponent = () => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallbackCompact
          title="Component Error"
          message="This component failed to load."
        />
      }
    >
      <ComplexComponent />
    </ErrorBoundary>
  );
};
```

## Features

### Development Mode

- **Detailed error information** including stack traces and component stacks
- **Testing utilities** to trigger different types of errors
- **Console logging** for debugging

### Production Mode

- **User-friendly error messages** without technical details
- **Recovery options** (retry, reload, go home)
- **Error reporting** (ready for integration with services like Sentry)

### Error Types Caught

- JavaScript runtime errors
- Component render errors
- Async errors within components
- Null/undefined reference errors

### Error Types NOT Caught

- Event handler errors (use try-catch)
- Async errors outside of render (use .catch())
- Errors in useEffect (use try-catch)
- Server-side rendering errors

## Best Practices

### 1. Granular Error Boundaries

Place error boundaries at multiple levels:

```tsx
// App level (already implemented)
<ErrorBoundary>
  {' '}
  {/* Global */}
  // Page level
  <ErrorBoundary>
    {' '}
    {/* Page-specific */}
    // Component level
    <ErrorBoundary>
      {' '}
      {/* Critical components */}
      <CriticalComponent />
    </ErrorBoundary>
  </ErrorBoundary>
</ErrorBoundary>
```

### 2. Custom Error Handling

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to monitoring service
    if (process.env.NODE_ENV === 'production') {
      logErrorToSentry(error, errorInfo);
    }

    // Track in analytics
    trackErrorEvent(error.message);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 3. Graceful Degradation

```tsx
<ErrorBoundary
  fallback={
    <ErrorFallback
      title="Feature Unavailable"
      message="This feature is temporarily unavailable. You can continue using other parts of the app."
      showHomeButton={false}
      size="sm"
    />
  }
>
  <OptionalFeature />
</ErrorBoundary>
```

## Testing

### Manual Testing (Development)

1. Include `<ErrorBoundaryTest />` in your component during development
2. Use the provided buttons to test different error scenarios
3. Verify error boundaries catch and display fallback UI correctly

### Programmatic Testing

```tsx
const TestComponent = () => {
  const { throwError } = useErrorBoundaryTest();

  return (
    <div>
      <button onClick={() => throwError('Custom test error')}>
        Test Error Boundary
      </button>
    </div>
  );
};
```

## Integration with Error Reporting Services

To integrate with services like Sentry, LogRocket, or Bugsnag:

```tsx
// In MainProvider.tsx or specific error boundaries
const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  }

  // Production error reporting
  if (process.env.NODE_ENV === 'production') {
    // Sentry example
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Custom analytics
    analytics.track('Error Boundary Triggered', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }
};
```

## Troubleshooting

### Common Issues

1. **Error boundary not catching errors**: Ensure errors are thrown during render, not in event handlers
2. **Fallback UI not showing**: Check if error boundary is properly wrapping the component
3. **Testing not working**: Verify you're in development mode

### Debugging

- Check browser console for error logs
- Use React Developer Tools to inspect error boundary state
- Test with `ErrorBoundaryTest` component in development

## Examples

See the existing codebase for implementation examples:

- Global setup: `src/providers/MainProvider.tsx`
- Component usage: Throughout the application
- Testing: Use `ErrorBoundaryTest` component in development
