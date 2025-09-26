export const formattedDate = (utcValue: Date) => {
  return new Date(utcValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
