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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    const kValue = (amount / 1000).toFixed(1);
    // Remove .0 if it's a whole number
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
