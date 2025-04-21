import { appendIdFromURL, filterOutNulls, calculateTotalPages } from './utils';

describe('utils.ts', () => {
  describe('appendIdFromURL', () => {
    it('should extract the last segment of the URL as id', () => {
      const input = { url: 'https://swapi.dev/api/people/10/' };
      const result = appendIdFromURL(input);
      expect(result.id).toBe('10');
    });

    it('should work without a trailing slash', () => {
      const input = { url: 'https://swapi.dev/api/people/7' };
      const result = appendIdFromURL(input);
      expect(result.id).toBe('7');
    });

    it('should return empty string if no match', () => {
      const input = { url: 'invalid-url' };
      const result = appendIdFromURL(input);
      expect(result.id).toBe('');
    });
  });

  describe('filterOutNulls', () => {
    it('should remove null values from array', () => {
      const input = [1, null, 2, null, 3];
      const result = filterOutNulls(input);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      const input: (number | null)[] = [];
      const result = filterOutNulls(input);
      expect(result).toEqual([]);
    });

    it('should return same array if no nulls', () => {
      const input = ['a', 'b', 'c'];
      const result = filterOutNulls(input);
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });

  describe('calculateTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(calculateTotalPages(100, 10)).toBe(10);
      expect(calculateTotalPages(101, 10)).toBe(11);
    });

    it('should return 0 if limit is 0', () => {
      expect(calculateTotalPages(100, 0)).toBe(0);
    });

    it('should return 0 if limit is negative', () => {
      expect(calculateTotalPages(50, -5)).toBe(0);
    });

    it('should return 0 if count is 0', () => {
      expect(calculateTotalPages(0, 10)).toBe(0);
    });
  });
});
