/**
 * Example Usage of LoadingSkeleton Component
 *
 * This file demonstrates different ways to use the LoadingSkeleton component
 * for creating consistent loading states across the site.
 */

import { Suspense } from 'react';
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

// Example 1: Simple Blog Card Loading State
export function BlogCardLoadingExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-5">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </div>
  );
}

// Example 2: Text Content Loading State
export function TextContentLoadingExample() {
  return (
    <div className="space-y-4 p-5">
      {/* Title skeleton */}
      <LoadingSkeleton
        variant="text"
        width="60%"
        height="32px"
        className="h-8"
      />

      {/* Paragraph skeletons */}
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="100%" />
        <LoadingSkeleton variant="text" width="95%" />
        <LoadingSkeleton variant="text" width="88%" />
      </div>

      {/* Another paragraph */}
      <div className="space-y-2 mt-4">
        <LoadingSkeleton variant="text" width="100%" />
        <LoadingSkeleton variant="text" width="92%" />
      </div>
    </div>
  );
}

// Example 3: Custom Loading State (Profile Card)
export function ProfileCardLoadingExample() {
  return (
    <div className="p-5 space-y-4">
      {/* Avatar skeleton - circular */}
      <LoadingSkeleton
        variant="custom"
        className="w-24 h-24 rounded-full mx-auto"
      />

      {/* Name skeleton */}
      <LoadingSkeleton variant="text" width="50%" className="mx-auto" />

      {/* Bio skeleton */}
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="100%" />
        <LoadingSkeleton variant="text" width="90%" />
        <LoadingSkeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

// Example 4: List Loading State
export function ListLoadingExample() {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {[1, 2, 3, 4, 5].map((index) => (
        <li key={index} className="py-4">
          <div className="flex gap-4">
            {/* Image skeleton */}
            <LoadingSkeleton
              variant="custom"
              className="w-24 h-24 rounded-lg flex-shrink-0"
            />

            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <LoadingSkeleton variant="text" width="70%" className="h-6" />
              <LoadingSkeleton variant="text" width="100%" />
              <LoadingSkeleton variant="text" width="90%" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Example 5: Grid Loading State
export function GridLoadingExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <LoadingSkeleton
          key={index}
          variant="custom"
          className="aspect-square rounded-lg"
        />
      ))}
    </div>
  );
}

// Example 6: Using with Suspense
export function SuspenseLoadingExample() {
  return (
    <Suspense fallback={<BlogCardLoadingExample />}>
      {/* Your async component here */}
    </Suspense>
  );
}

// Example 7: Form Loading State
export function FormLoadingExample() {
  return (
    <div className="space-y-4 p-5">
      {/* Form field skeletons */}
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="30%" className="h-4" />
        <LoadingSkeleton variant="custom" className="w-full h-10 rounded" />
      </div>

      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="25%" className="h-4" />
        <LoadingSkeleton variant="custom" className="w-full h-10 rounded" />
      </div>

      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="35%" className="h-4" />
        <LoadingSkeleton variant="custom" className="w-full h-32 rounded" />
      </div>

      {/* Button skeleton */}
      <LoadingSkeleton variant="custom" className="w-32 h-10 rounded" />
    </div>
  );
}

// Note: Remember to wrap these in Suspense boundaries or use them in loading.tsx files
