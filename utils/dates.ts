export const formattedDate = (isoStringDate: string) => {
  return new Date(isoStringDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// 7 days (in seconds)
export const revalidateIn7Days = 60 * 60 * 24 * 7;

// 1 day (in seconds)
export const revalidateIn1Day = 60 * 60 * 24 * 1;

// 1 year (in seconds)
export const revalidateIn1Year = 60 * 60 * 24 * 365;
