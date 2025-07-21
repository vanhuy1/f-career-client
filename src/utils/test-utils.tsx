import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/services/state/authSlice';
import applicationReducer from '@/services/state/applicationsSlice';
import { applicantDetailReducer } from '@/services/state/applicantDetailSlice';

// Add more slices as needed
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      application: applicationReducer,
      applicantDetail: applicantDetailReducer,
      // Add other reducers as needed
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

// Custom render function that includes Redux Provider
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {},
): RenderResult & { store: ReturnType<typeof createTestStore> } {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock user factory
export const createMockUser = (overrides = {}) => ({
  name: 'Test User',
  username: 'testuser',
  roles: 'USER' as any,
  email: 'test@example.com',
  isAccountDisabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Mock company factory
export const createMockCompany = (overrides = {}) => ({
  id: '1',
  name: 'Test Company',
  description: 'A test company',
  website: 'https://testcompany.com',
  logo: '/test-logo.png',
  ...overrides,
});

// Mock job factory
export const createMockJob = (overrides = {}) => ({
  id: '1',
  title: 'Software Engineer',
  description: 'A test job description',
  companyId: '1',
  location: 'Remote',
  salary: 100000,
  employmentType: 'full-time',
  ...overrides,
});

// Mock auth response factory
export const createMockAuthResponse = (overrides: any = {}) => ({
  data: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    ...overrides.data,
  },
  meta: {
    message: 'Success',
    statusCode: 200,
    ...overrides.meta,
  },
});

// Common test IDs for consistent testing
export const testIds = {
  // Auth
  loginForm: 'login-form',
  signupForm: 'signup-form',
  loginButton: 'login-button',
  signupButton: 'signup-button',

  // Navigation
  sidebar: 'sidebar',
  header: 'header',
  navigationMenu: 'navigation-menu',

  // Job related
  jobCard: 'job-card',
  jobList: 'job-list',
  jobDetails: 'job-details',
  applyButton: 'apply-button',

  // Profile
  profileForm: 'profile-form',
  profileSaveButton: 'profile-save-button',

  // Common UI
  modal: 'modal',
  confirmDialog: 'confirm-dialog',
  loadingSpinner: 'loading-spinner',
  errorMessage: 'error-message',
  successMessage: 'success-message',
};

// Helper to wait for loading states
export const waitForLoadingToFinish = () => {
  // Implementation depends on your loading indicators
  // You might wait for specific elements to disappear or appear
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
