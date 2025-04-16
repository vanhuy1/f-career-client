'use client';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="spinner"></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(0, 0, 0, 0.1);
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-message {
          margin-top: 20px;
          font-size: 18px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
