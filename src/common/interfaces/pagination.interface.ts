export interface Paginated<T> {
  count: number;
  pages: number;
  results: T[];
}
