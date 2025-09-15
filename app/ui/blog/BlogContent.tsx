// components/BlogContent.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
    ...defaultSchema,
    // Only allow the tags you need:
    tagNames: [
        'h1',
        'h2',
        'h3', // headers
        'p', // paragraphs
        'blockquote', // quotes
        'strong',
        'em', // bold / italics
        'br',
        'hr', // line / horizontal rule ('---' in md)
    ],
    // Optionally restrict attributes further (defaultSchema is already strict).
    attributes: {
        // e.g., allow nothing special; keep it minimal
    },
};

export default function BlogContent({ markdown }: { markdown: string }) {
    return (
        <article className="prose prose-neutral lg:prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeSanitize, schema]]}
            >
                {markdown}
            </ReactMarkdown>
        </article>
    );
}
