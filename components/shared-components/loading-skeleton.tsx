import { cn } from '@/lib/utils/react-class-names';

interface LoadingSkeletonProps {
  /**
   * The variant of the loading skeleton to display
   * - card: A card-style skeleton for blog cards or similar components
   * - text: A simple text line skeleton
   * - custom: Allows for custom className to be passed
   */
  variant?: 'card' | 'text' | 'custom';
  /**
   * Additional CSS classes to apply to the skeleton
   */
  className?: string;
  /**
   * Width of the skeleton (for text variant)
   */
  width?: string;
  /**
   * Height of the skeleton
   */
  height?: string;
}

/**
 * A reusable loading skeleton component that provides consistent loading states across the site.
 * Uses Tailwind's animate-pulse utility for the loading animation and supports dark mode.
 */
export default function LoadingSkeleton({
  variant = 'custom',
  className,
  width,
  height,
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-zinc-800 animate-pulse';

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'w-90 mx-auto sm:w-96 h-80',
          baseClasses,
          'rounded-2xl',
          className
        )}
        aria-hidden="true"
      >
        <div className="h-full w-full flex flex-col justify-end rounded-2xl overflow-hidden">
          <div className="h-2/5 bg-gradient-to-t from-black/30 to-transparent p-5 space-y-3">
            <div className="h-5 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-300 dark:bg-zinc-700 rounded"></div>
            <div className="h-3 w-full bg-gray-300 dark:bg-zinc-700 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div
        className={cn(baseClasses, 'rounded', 'h-4', className)}
        style={{ width: width || '100%', height: height || undefined }}
        aria-hidden="true"
      />
    );
  }

  // custom variant - allows full control via className
  return (
    <div
      className={cn(baseClasses, 'rounded-2xl', className)}
      style={{ width: width || undefined, height: height || undefined }}
      aria-hidden="true"
    />
  );
}
