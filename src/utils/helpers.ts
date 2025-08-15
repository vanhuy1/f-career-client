/**
 * Format a date string to a more readable format
 * @param dateString The date string to format (YYYY-MM-DD)
 * @returns The formatted date string (e.g., "24 July 2021")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format as "DD Month YYYY"
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
