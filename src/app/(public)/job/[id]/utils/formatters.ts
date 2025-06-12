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
