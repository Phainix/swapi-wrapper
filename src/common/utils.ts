export const appendIdFromURL = <T extends { url: string }>(
  data: T,
): T & { id: string } => {
  const match = RegExp(/\/([^/]+)\/?$/).exec(data.url);
  const lastSegment = match ? match[1] : '';

  return {
    ...data,
    id: lastSegment,
  };
};

export const filterOutNulls = <T>(data: (T | null)[]): T[] => {
  return data.filter((item): item is T => item !== null);
};

export const calculateTotalPages = (count: number, limit: number): number => {
  if (limit <= 0) return 0;
  return Math.ceil(count / limit);
};
