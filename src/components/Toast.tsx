import React, { ReactNode } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Props type for ToastWrapper
interface ToastWrapperProps {
  children: ReactNode;
}

// ToastWrapper component to manage ToastContainer configuration
// ToastComponents.tsx
export const ToastWrapper: React.FC<ToastWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-4"
      />
    </>
  );
};
// Props type for toast components
interface ToastProps {
  message?: string;
}

// SuccessToast component
const SuccessToast: React.FC<ToastProps> = ({
  message = 'Operation successful!',
}) => {
  const showToast = () => {
    toast.success(message, {
      className: 'bg-green-500 text-white font-semibold',
    });
  };

  return (
    <button
      onClick={showToast}
      className="rounded-md bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-700"
    >
      Show Success Toast
    </button>
  );
};

// ErrorToast component
const ErrorToast: React.FC<ToastProps> = ({
  message = 'Something went wrong!',
}) => {
  const showToast = () => {
    toast.error(message, {
      className: 'bg-red-500 text-white font-semibold',
    });
  };

  return (
    <button
      onClick={showToast}
      className="rounded-md bg-red-600 px-4 py-2 text-white transition duration-200 hover:bg-red-700"
    >
      Show Error Toast
    </button>
  );
};

// InfoToast component
const InfoToast: React.FC<ToastProps> = ({ message = "Here's some info!" }) => {
  const showToast = () => {
    toast.info(message, {
      className: 'bg-blue-500 text-white font-semibold',
    });
  };

  return (
    <button
      onClick={showToast}
      className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700"
    >
      Show Info Toast
    </button>
  );
};

// WarningToast component
const WarningToast: React.FC<ToastProps> = ({
  message = 'Please be cautious!',
}) => {
  const showToast = () => {
    toast.warn(message, {
      className: 'bg-yellow-500 text-white font-semibold',
    });
  };

  return (
    <button
      onClick={showToast}
      className="rounded-md bg-yellow-600 px-4 py-2 text-white transition duration-200 hover:bg-yellow-700"
    >
      Show Warning Toast
    </button>
  );
};

// Main ToastComponents component
const ToastComponents: React.FC = () => {
  return (
    <ToastWrapper>
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Reusable Toast Components
        </h1>
        <div className="flex space-x-4">
          <SuccessToast message="Task completed successfully!" />
          <ErrorToast message="Failed to process request!" />
          <InfoToast message="New update available!" />
          <WarningToast message="Low battery warning!" />
        </div>
      </div>
    </ToastWrapper>
  );
};

export default ToastComponents;
