'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
    ...defaultSchema,
    tagNames: ['h1', 'h2', 'h3', 'p', 'blockquote', 'strong', 'em', 'br', 'hr'],
    attributes: {},
};

export default function BlogContent({ markdown }: { markdown: string }) {
    return (
        <article className="prose prose-neutral lg:prose-lg max-w-none py-5">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeSanitize, schema]]}
            >
                {markdown}
            </ReactMarkdown>
        </article>
    );
}
