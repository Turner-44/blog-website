import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...compat.config({
    extends: [
      'next',
      'next/typescript',
      'next/core-web-vitals',
      'next/typescript',
    ],
  }),
  //...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
