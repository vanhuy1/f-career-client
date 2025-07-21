// This is an example test for utility functions
// The actual implementation may differ in your project

describe('Formatter Utilities', () => {
  // Mock implementation of formatters
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (date: Date | string, format = 'short') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (format === 'short') {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateObj.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
    });

    it('should handle edge cases', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(999999999)).toBe('$999,999,999.00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');

    it('should format date with short format', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toMatch(/Jan 15, 2024|Jan 14, 2024/); // Account for timezone differences
    });

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15', 'short');
      expect(result).toMatch(/Jan 15, 2024|Jan 14, 2024/);
    });

    it('should handle default format', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/1\/1[45]\/2024|Jan 1[45], 2024/); // Account for timezone differences
    });

    it('should handle invalid dates gracefully', () => {
      expect(() => formatDate('invalid-date')).not.toThrow();
    });
  });

  describe('truncateText', () => {
    it('should truncate text when it exceeds max length', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('should return original text when it is shorter than max length', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should return original text when it equals max length', () => {
      const exactText = 'Exact length text';
      expect(truncateText(exactText, 17)).toBe('Exact length text');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('A', 0)).toBe('...');
      expect(truncateText('Test', 1)).toBe('T...');
    });
  });

  describe('Integration tests', () => {
    it('should format job salary display correctly', () => {
      const jobSalary = 85000;
      const formattedSalary = formatCurrency(jobSalary);
      expect(formattedSalary).toBe('$85,000.00');
    });

    it('should format and truncate job description', () => {
      const longDescription =
        'This is a very long job description that needs to be truncated for display in the job card component';
      const truncatedDescription = truncateText(longDescription, 50);
      expect(truncatedDescription).toBe(
        'This is a very long job description that needs to ...',
      );
      expect(truncatedDescription.length).toBeLessThanOrEqual(53); // 50 + '...'
    });
  });
});
