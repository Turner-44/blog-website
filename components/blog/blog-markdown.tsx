import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { useMDXComponents } from '@/mdx-components';

const components = useMDXComponents();

const schema = {
    ...defaultSchema,
    tagNames: ['h1', 'h2', 'h3', 'p', 'blockquote', 'strong', 'em', 'br', 'hr'],
    attributes: {},
};

export default function BlogContent({ markdown }: { markdown: string }) {
    return (
        <article className="prose prose-neutral lg:prose-lg max-w-none py-5">
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
