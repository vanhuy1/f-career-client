import { employmentType } from '@/enums/employmentType';

/**
 * Format date string to "Month DD, YYYY" format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format salary to USD format with K abbreviation
 * Examples:
 * - 950 -> "$950" (under 1,000)
 * - 22000 -> "$22K" (1,000 and above)
 */
export function formatSalary(amount: number): string {
  if (amount < 1000) {
    // Dưới 1,000: hiển thị đầy đủ
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    // Từ 1,000 trở lên: dùng K
    const kValue = (amount / 1000).toFixed(1);
    // Loại bỏ .0 nếu là số nguyên
    const cleanKValue = kValue.endsWith('.0') ? kValue.slice(0, -2) : kValue;
    return `$${cleanKValue}K`;
  }
}

/**
 * Format salary range based on min and max values
 * Cases:
 * 1. If min > 0 and max < 99999: show range "$min-max"
 * 2. If min = 0: show "Up to $max"
 * 3. If max = 99999: show "From $min"
 */
export function formatSalaryRange(min: number, max: number): string {
  // Convert string inputs to numbers if needed
  const minValue = Number(min);
  const maxValue = Number(max);

  // Case 4: Both min and max are 0 (negotiable)
  if (minValue === 0 && maxValue === 0) {
    return 'Negotiable';
  }

  // Case 2: Only max salary (min = 0)
  if (minValue === 0 && maxValue > 0) {
    return `Up to ${formatSalary(maxValue)}`;
  }

  // Case 3: Only min salary (max = 999999)
  if (minValue > 0 && maxValue === 999999) {
    return `From ${formatSalary(minValue)}`;
  }

  // Case 1: Both min and max
  return `${formatSalary(minValue)} - ${formatSalary(maxValue)}`;
}

/**
 * Format time as "X mins ago" if less than 1 hour ago, otherwise as "HH:MM AM/PM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) {
    // Future date, fallback to time
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (diffMins < 60) {
    return diffMins === 1 ? '1 min ago' : `${diffMins} mins ago`;
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatEmploymentType(code?: string): string {
  if (!code) return 'Not specified';
  const key = code as keyof typeof employmentType;
  if (employmentType[key]) return employmentType[key];
  const pretty = code
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return pretty;
}
