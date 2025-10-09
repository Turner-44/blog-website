export * from './blog-schema';
export * from './image-schema';
export * from './markdown-schema';
export * from './field-schema';

export type TreeifiedError = {
  errors: string[];
  properties?: Record<string, { errors: string[] }>;
};
