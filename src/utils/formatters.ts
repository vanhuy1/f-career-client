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
 * Format salary to "k" format
 * Example: 22000 -> "22k"
 */
export function formatSalary(amount: number): string {
  return `${Math.floor(amount / 1000)}k`;
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

  // Case 2: Only max salary (min = 0)
  if (minValue === 0 && maxValue > 0) {
    return `Up to $${formatSalary(maxValue)}`;
  }

  // Case 3: Only min salary (max = 999999)
  if (minValue > 0 && maxValue === 999999) {
    return `From $${formatSalary(minValue)}`;
  }

  // Case 1: Both min and max
  return `${formatSalary(minValue)}$-${formatSalary(maxValue)}$`;
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
