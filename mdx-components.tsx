import React, { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type EmProps = ComponentPropsWithoutRef<'em'>;
type StrongProps = ComponentPropsWithoutRef<'strong'>;
type HrProps = ComponentPropsWithoutRef<'hr'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type PreProps = ComponentPropsWithoutRef<'pre'>;
type CodeProps = ComponentPropsWithoutRef<'code'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;

const components = {
  h1: (props: HeadingProps) => <h1 className="" {...props} />,
  h2: (props: HeadingProps) => <h2 className="py-2" {...props} />,
  h3: (props: HeadingProps) => <h3 className="py-2" {...props} />,
  h4: (props: HeadingProps) => <h4 className="py-1" {...props} />,
  p: (props: ParagraphProps) => (
    <p className="py-3 leading-relaxed text-justify" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="list-decimal list-outside marker:font-bold" {...props} />
  ),
  ul: (props: ListProps) => <ul className="list-none pl-5 my-2" {...props} />,
  li: (props: ListItemProps) => <li className="py-0.5" {...props} />,
  em: (props: EmProps) => <em className="" {...props} />,
  strong: (props: StrongProps) => <strong className="" {...props} />,
  hr: (props: HrProps) => <hr className="my-5" {...props} />,
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="" {...props} />
  ),
  pre: (props: PreProps) => <pre className="" {...props} />,

  Image: (props: ImageProps) => (
    <Image className="" loading="lazy" {...props} />
  ),

  code: (props: CodeProps) => <code className="" {...props} />,
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = 'underline';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
