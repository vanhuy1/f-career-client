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
 * Format salary to "k" format with USD
 * Example: 22000 -> "22k USD"
 */
export function formatSalary(amount: number): string {
  return `${Math.floor(amount / 1000)}k`;
}

/**
 * Format salary range
 * Example: min: 22000, max: 28000 -> "$22k-28k USD"
 */
export function formatSalaryRange(min: number, max: number): string {
  return `$${formatSalary(min)}-${formatSalary(max)} USD`;
}
