// settings-components/Contact.tsx
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Cv } from '@/types/Cv';

interface ContactProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
}

interface ValidationErrors {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

const Contact = ({ cv, onUpdateCv }: ContactProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return undefined;
  };

  const validatePhone = (phone: number | string): string | undefined => {
    const phoneStr = phone.toString();
    if (!phoneStr) return 'Phone number is required';
    // Vietnamese phone regex - accepts 10-11 digits
    const phoneRegex = /^(0|84|\+84)?[3|5|7|8|9][0-9]{8,9}$/;
    if (!phoneRegex.test(phoneStr)) {
      return 'Invalid phone number (Vietnamese format: 10-11 digits)';
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

  // Handle field changes with validation
  const handleFieldChange = <K extends keyof Cv>(
    field: K,
    value: Cv[K],
    validator?: (value: Cv[K]) => string | undefined,
  ) => {
    onUpdateCv(field, value);

    if (validator && touched[field as string]) {
      const error = validator(value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  // Handle field blur for string fields
  const handleStringFieldBlur = (
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

  // Handle field blur for number fields
  const handleNumberFieldBlur = (
    field: keyof ValidationErrors,
    value: number,
    validator: (value: number | string) => string | undefined,
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validator(value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Format phone number for display
  const formatPhoneDisplay = (phone: number | string): string => {
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `${phoneStr.slice(0, 4)} ${phoneStr.slice(4, 7)} ${phoneStr.slice(7)}`;
    } else if (phoneStr.length === 11) {
      return `${phoneStr.slice(0, 5)} ${phoneStr.slice(5, 8)} ${phoneStr.slice(8)}`;
    }
    return phoneStr;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayMail">Display Email</Label>
          <Switch
            id="displayMail"
            checked={cv.displayMail}
            onCheckedChange={(checked) => onUpdateCv('displayMail', checked)}
          />
        </div>
        <div>
          <Input
            id="email"
            type="email"
            value={cv.email}
            onChange={(e) =>
              handleFieldChange('email', e.target.value, validateEmail)
            }
            onBlur={() =>
              handleStringFieldBlur('email', cv.email, validateEmail)
            }
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
          <Label htmlFor="phone">Phone Number</Label>
        </div>
        <div>
          <Input
            id="phone"
            type="tel"
            value={cv.phone ? formatPhoneDisplay(cv.phone) : ''}
            onChange={(e) => {
              // Remove all non-numeric characters
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 11) {
                // Limit to 11 digits
                const numValue = value ? Number(value) : 0;
                handleFieldChange('phone', numValue, validatePhone);
              }
            }}
            onBlur={() =>
              handleNumberFieldBlur('phone', cv.phone, validatePhone)
            }
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
                handleStringFieldBlur(
                  'linkedin',
                  cv.linkedin || '',
                  validateLinkedIn,
                )
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
                handleStringFieldBlur('github', cv.github || '', validateGitHub)
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
