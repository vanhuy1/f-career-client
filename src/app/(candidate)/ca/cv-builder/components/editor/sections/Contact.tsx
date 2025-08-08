// Updated Contact.tsx with complete validation before save
import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Cv } from '@/types/Cv';

interface ContactProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
  onValidationChange?: (isValid: boolean) => void; // Callback to parent
}

interface ValidationErrors {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

const Contact = ({ cv, onUpdateCv, onValidationChange }: ContactProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'Phone number is required';
    // Vietnamese phone regex - accepts 10-11 digits starting with 0
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8,9}$/;
    if (!phoneRegex.test(phone)) {
      return 'Invalid phone number (Vietnamese format: 10-11 digits starting with 0)';
    }
    return undefined;
  };

  const validateLinkedIn = (linkedin: string): string | undefined => {
    if (!linkedin) return undefined; // Optional field
    // Check if it's a valid LinkedIn URL or username
    const linkedinRegex =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-._]+\/?$/;
    const usernameRegex = /^[a-zA-Z0-9-._]+$/;

    if (!linkedinRegex.test(linkedin) && !usernameRegex.test(linkedin)) {
      return 'Invalid LinkedIn URL or username';
    }
    return undefined;
  };

  const validateGitHub = (github: string): string | undefined => {
    if (!github) return undefined; // Optional field
    // Check if it's a valid GitHub URL or username
    const githubRegex =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-._]+\/?$/;
    const usernameRegex = /^[a-zA-Z0-9-._]+$/;

    if (!githubRegex.test(github) && !usernameRegex.test(github)) {
      return 'Invalid GitHub URL or username';
    }
    return undefined;
  };

  // Validate all fields and return overall validity - wrapped in useCallback
  const validateAll = useCallback((): boolean => {
    const phoneValue =
      typeof cv.phone === 'number' ? String(cv.phone) : cv.phone || '';

    const newErrors: ValidationErrors = {
      email: validateEmail(cv.email),
      phone: validatePhone(phoneValue),
      linkedin: cv.displayLinkedIn
        ? validateLinkedIn(cv.linkedin || '')
        : undefined,
      github: cv.displayGithub ? validateGitHub(cv.github || '') : undefined,
    };

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      email: true,
      phone: true,
      linkedin: cv.displayLinkedIn,
      github: cv.displayGithub,
    });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(
      (error) => error !== undefined,
    );
    return !hasErrors;
  }, [
    cv.email,
    cv.phone,
    cv.linkedin,
    cv.github,
    cv.displayLinkedIn,
    cv.displayGithub,
  ]);

  // Notify parent about validation status whenever it changes
  useEffect(() => {
    const isValid = validateAll();
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [
    cv.email,
    cv.phone,
    cv.linkedin,
    cv.github,
    cv.displayLinkedIn,
    cv.displayGithub,
    onValidationChange,
    validateAll,
  ]);

  // Handle field changes with validation - fixed type issue
  const handleFieldChange = <K extends keyof Cv>(
    field: K,
    value: Cv[K],
    validator?: (value: string) => string | undefined,
  ) => {
    onUpdateCv(field, value);

    if (validator && touched[field as string]) {
      // Convert value to string for validation
      const stringValue = typeof value === 'string' ? value : String(value);
      const error = validator(stringValue);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (
    field: keyof ValidationErrors,
    value: string,
    validator: (value: string) => string | undefined,
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validator(value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Format phone number for display
  const formatPhoneDisplay = (phone: string): string => {
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `${phoneStr.slice(0, 4)} ${phoneStr.slice(4, 7)} ${phoneStr.slice(7)}`;
    } else if (phoneStr.length === 11) {
      return `${phoneStr.slice(0, 5)} ${phoneStr.slice(5, 8)} ${phoneStr.slice(8)}`;
    }
    return phoneStr;
  };

  // Convert phone from number to string for display
  const phoneValue =
    typeof cv.phone === 'number' ? String(cv.phone) : cv.phone || '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={cv.email}
            onChange={(e) =>
              handleFieldChange('email', e.target.value, validateEmail)
            }
            onBlur={() => handleFieldBlur('email', cv.email, validateEmail)}
            placeholder="your.email@example.com"
            className={errors.email && touched.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
        </div>
        <div>
          <Input
            id="phone"
            type="text"
            value={formatPhoneDisplay(phoneValue)}
            onChange={(e) => {
              // Remove all non-numeric characters
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 11) {
                // Store as string to preserve leading zeros - fixed type
                handleFieldChange('phone', value as Cv['phone'], validatePhone);
              }
            }}
            onBlur={() => handleFieldBlur('phone', phoneValue, validatePhone)}
            placeholder="0912 345 678"
            className={errors.phone && touched.phone ? 'border-red-500' : ''}
            required
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Vietnamese format: 10-11 digits starting with 03, 05, 07, 08, 09
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayLinkedIn">Display LinkedIn</Label>
          <Switch
            id="displayLinkedIn"
            checked={cv.displayLinkedIn}
            onCheckedChange={(checked) =>
              onUpdateCv('displayLinkedIn', checked)
            }
          />
        </div>
        {cv.displayLinkedIn && (
          <div>
            <Input
              id="linkedin"
              value={cv.linkedin || ''}
              onChange={(e) =>
                handleFieldChange('linkedin', e.target.value, validateLinkedIn)
              }
              onBlur={() =>
                handleFieldBlur('linkedin', cv.linkedin || '', validateLinkedIn)
              }
              placeholder="linkedin.com/in/username or username"
              className={
                errors.linkedin && touched.linkedin ? 'border-red-500' : ''
              }
            />
            {errors.linkedin && touched.linkedin && (
              <p className="mt-1 text-xs text-red-500">{errors.linkedin}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter full URL or just username
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayGithub">Display GitHub</Label>
          <Switch
            id="displayGithub"
            checked={cv.displayGithub}
            onCheckedChange={(checked) => onUpdateCv('displayGithub', checked)}
          />
        </div>
        {cv.displayGithub && (
          <div>
            <Input
              id="github"
              value={cv.github || ''}
              onChange={(e) =>
                handleFieldChange('github', e.target.value, validateGitHub)
              }
              onBlur={() =>
                handleFieldBlur('github', cv.github || '', validateGitHub)
              }
              placeholder="github.com/username or username"
              className={
                errors.github && touched.github ? 'border-red-500' : ''
              }
            />
            {errors.github && touched.github && (
              <p className="mt-1 text-xs text-red-500">{errors.github}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter full URL or just username
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
