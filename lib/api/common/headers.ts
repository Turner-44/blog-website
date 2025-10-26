import {
  revalidateIn1Day,
  revalidateIn1Year,
  revalidateIn7Days,
} from '@/utils/dates';

export const SevenDayCacheHeader = !process.env.NEXT_PUBLIC_POINTED_AT_TEST
  ? {
      'Cache-Control': `s-maxage=${revalidateIn7Days}, stale-while-revalidate=${revalidateIn1Day}`,
    }
  : { 'Cache-Control': 'no-cache, no-store, must-revalidate' };

export const AWSCacheValue = !process.env.NEXT_PUBLIC_POINTED_AT_TEST
  ? `public, max-age=${revalidateIn1Year}, immutable`
  : `no-cache, no-store, must-revalidate`;

export const NoCacheHeader = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};
