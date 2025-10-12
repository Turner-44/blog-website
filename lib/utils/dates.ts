export const formattedDate = (isoStringDate: string) => {
  return new Date(isoStringDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const revalidateIn7Days = 60 * 60 * 24 * 7;
