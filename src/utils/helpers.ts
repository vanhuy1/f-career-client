/**
 * Format a date string to a more readable format
 * @param dateString The date string to format (YYYY-MM-DD)
 * @returns The formatted date string (e.g., "24 July 2021")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format as "DD Month YYYY"
  return `${date.getDate()} July ${date.getFullYear()}`;
};
