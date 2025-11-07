import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { useMDXComponents } from '@/mdx-components';

// eslint-disable-next-line
const components = useMDXComponents();

export const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),

    // Headings
    'h1',
    'h2',
    'h3',
    'h4',

    // Text content
    'p',
    'strong',
    'em',
    'blockquote',
    'code',
    'pre',

    // Lists
    'ul',
    'ol',
    'li',

    // Links and media
    'a',
    'img',

    // Misc
    'br',
    'hr',
  ],

  attributes: {
    ...(defaultSchema.attributes || {}),

    // Links — allow safe navigation
    a: [
      ...(defaultSchema.attributes?.a || []),
      'href',
      'title',
      'target',
      'rel',
      'className',
    ],

    // Images — allow source and descriptive text
    img: [
      ...(defaultSchema.attributes?.img || []),
      'src',
      'alt',
      'title',
      'width',
      'height',
      'className',
      'loading',
    ],

    // Paragraphs and headings — for Tailwind typography
    p: [...(defaultSchema.attributes?.p || []), 'className'],
    h1: [...(defaultSchema.attributes?.h1 || []), 'className'],
    h2: [...(defaultSchema.attributes?.h2 || []), 'className'],
    h3: [...(defaultSchema.attributes?.h3 || []), 'className'],
    h4: [...(defaultSchema.attributes?.h4 || []), 'className'],

    // Lists
    ul: [...(defaultSchema.attributes?.ul || []), 'className'],
    ol: [...(defaultSchema.attributes?.ol || []), 'className'],
    li: [...(defaultSchema.attributes?.li || []), 'className'],

    // Code blocks
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className'],

    // Blockquotes
    blockquote: [...(defaultSchema.attributes?.blockquote || []), 'className'],
  },
};

export default function BlogContent({ markdown }: { markdown: string }) {
  return (
    <article className="px-10">
      <MDXRemote
        source={markdown}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypeSanitize, schema]],
          },
        }}
      />
    </article>
  );
}
