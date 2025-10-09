export const formattedDate = (isoStringDate: string) => {
  return new Date(isoStringDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
