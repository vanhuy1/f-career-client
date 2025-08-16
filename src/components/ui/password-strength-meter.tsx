'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    regex: /^.{8,}$/,
    text: 'At least 8 characters',
  },
  {
    regex: /(?=.*[a-z])/,
    text: 'At least one lowercase letter',
  },
  {
    regex: /(?=.*[A-Z])/,
    text: 'At least one uppercase letter',
  },
  {
    regex: /(?=.*\d)/,
    text: 'At least one number',
  },
  {
    regex: /(?=.*[@$!%*?&])/,
    text: 'At least one special character (@$!%*?&)',
  },
];

/**
 * Calculates the strength score of a password based on requirements
 */
const calculatePasswordStrength = (password: string): number => {
  return passwordRequirements.reduce((score, requirement) => {
    return requirement.regex.test(password) ? score + 1 : score;
  }, 0);
};

/**
 * Gets the color and label for password strength indicator
 */
const getStrengthIndicator = (score: number) => {
  if (score === 0) return { color: 'bg-gray-200', label: '' };
  if (score <= 2) return { color: 'bg-red-500', label: 'Weak' };
  if (score <= 3) return { color: 'bg-yellow-500', label: 'Fair' };
  if (score <= 4) return { color: 'bg-blue-500', label: 'Good' };
  return { color: 'bg-green-500', label: 'Strong' };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const score = calculatePasswordStrength(password);
  const { color, label } = getStrengthIndicator(score);
  const percentage = (score / passwordRequirements.length) * 100;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Password Strength
            </span>
            {label && (
              <span
                className={`text-sm font-medium ${
                  score <= 2
                    ? 'text-red-600'
                    : score <= 3
                      ? 'text-yellow-600'
                      : score <= 4
                        ? 'text-blue-600'
                        : 'text-green-600'
                }`}
              >
                {label}
              </span>
            )}
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">
          Password Requirements:
        </h4>
        <ul className="space-y-1">
          {passwordRequirements.map((requirement, index) => {
            const isValid = requirement.regex.test(password);
            return (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    isValid ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {isValid ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <X className="h-3 w-3 text-gray-500" />
                  )}
                </div>
                <span className={isValid ? 'text-green-700' : 'text-gray-600'}>
                  {requirement.text}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
