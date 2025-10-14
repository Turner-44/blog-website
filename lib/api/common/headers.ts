import {
  revalidateIn1Day,
  revalidateIn1Year,
  revalidateIn7Days,
} from '@/lib/utils/dates';

export const SevenDayCacheHeader = {
  'Cache-Control': `s-maxage=${revalidateIn7Days}, stale-while-revalidate=${revalidateIn1Day}`,
};

export const AWSCacheValue = `public, max-age=${revalidateIn1Year}, immutable`;
