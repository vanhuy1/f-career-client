import React from 'react';
import { AiPointsDisplay } from './AiPointsDisplay';
import { AiPointsManager } from './AiPointsManager';

export const AiPointsSection: React.FC = () => {
  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          AI Points Management
        </h2>
        <p className="mt-1 text-gray-600">
          Manage your AI points for premium features like CV optimization and
          roadmap generation.
        </p>
        <div className="mt-4 border-t border-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AiPointsDisplay />
        <AiPointsManager />
      </div>
    </section>
  );
};
