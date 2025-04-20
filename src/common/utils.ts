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
