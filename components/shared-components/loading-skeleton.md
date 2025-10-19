# LoadingSkeleton Component

A reusable loading skeleton component that provides consistent loading states across the site.

## Features

- Supports dark mode
- Uses Tailwind's `animate-pulse` for smooth animations
- Multiple variants for different use cases
- Fully customizable with className prop

## Usage

### Card Variant (Blog Card Loading)

```tsx
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

// Display a blog card skeleton
<LoadingSkeleton variant="card" />

// Customize with additional classes
<LoadingSkeleton variant="card" className="my-custom-class" />
```

### Text Variant (Simple Text Lines)

```tsx
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

// Display a text line skeleton
<LoadingSkeleton variant="text" width="200px" />

// Multiple text lines with different widths
<div className="space-y-2">
  <LoadingSkeleton variant="text" width="100%" />
  <LoadingSkeleton variant="text" width="80%" />
  <LoadingSkeleton variant="text" width="90%" />
</div>
```

### Custom Variant (Full Control)

```tsx
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

// Use custom className for complete control
<LoadingSkeleton
  variant="custom"
  className="w-full h-48"
/>

// Create custom loading states
<LoadingSkeleton
  variant="custom"
  className="w-32 h-32 rounded-full"
  width="128px"
  height="128px"
/>
```

## Props

| Prop        | Type                           | Default    | Description                                        |
| ----------- | ------------------------------ | ---------- | -------------------------------------------------- |
| `variant`   | `'card' \| 'text' \| 'custom'` | `'custom'` | The type of skeleton to display                    |
| `className` | `string`                       | -          | Additional CSS classes to apply                    |
| `width`     | `string`                       | -          | Width of the skeleton (primarily for text variant) |
| `height`    | `string`                       | -          | Height of the skeleton                             |

## Examples in the Codebase

### Blog Card Skeleton

The `BlogCardSkeleton` component uses the `LoadingSkeleton` component:

```tsx
// components/blog/carousel/loading-skeleton.tsx
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

export default function BlogCardSkeleton() {
  return <LoadingSkeleton variant="card" />;
}
```

### Page Loading State

You can use it in Suspense fallbacks:

```tsx
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/shared-components/loading-skeleton';

<Suspense
  fallback={
    <div className="grid grid-cols-3 gap-4">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </div>
  }
>
  <YourComponent />
</Suspense>;
```

## Accessibility

The component includes `aria-hidden="true"` to ensure screen readers skip the loading skeleton, providing a better experience for users with assistive technologies.

## Styling

The component uses:

- `bg-gray-200 dark:bg-zinc-800` for the base background
- `animate-pulse` for the loading animation
- `rounded-2xl` for rounded corners (customizable)
- Dark mode support out of the box
