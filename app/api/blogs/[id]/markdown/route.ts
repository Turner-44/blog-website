import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME, s3Client } from '@/lib/s3';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) return new Response('Unauthorized', { status: 401 });
        if (session.user?.email !== process.env.ADMIN_EMAIL) {
            return new Response('Forbidden', { status: 403 });
        }

        const reqData = await req.json();
        const markdown = reqData.markdown;

        if (!markdown) {
            return NextResponse.json(
                { error: 'Markdown content is required' },
                { status: 400 }
            );
        }

        if (typeof markdown !== 'string') {
            return NextResponse.json(
                { error: 'Markdown content must be in string format' },
                { status: 400 }
            );
        }

        if (typeof reqData.blogId !== 'string') {
            return NextResponse.json(
                { error: 'Blog ID must be in string format' },
                { status: 400 }
            );
        }

        const markdownKey = `blog-posts/${reqData.blogId}/content/blog.mdx`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: markdownKey,
                Body: markdown,
                CacheControl: 'public, max-age=31536000, immutable',
            })
        );

        return NextResponse.json(
            {
                blogId: reqData.blogId,
                markdownKey,
            },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error('API Error: ', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const markdownKey = url.searchParams.get('markdownKey');

    if (!markdownKey) {
        return NextResponse.json(
            {
                error: `Missing markdownKey parameter`,
            },
            { status: 400 }
        );
    }

    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: markdownKey,
        });

        const s3Res = await s3Client.send(command);
        const markdown = await s3Res.Body?.transformToString();

        if (!markdown) {
            notFound();
        }

        return NextResponse.json(
            { markdown },
            {
                status: 200,
                headers: {
                    'Cache-Control':
                        's-maxage=31536000, stale-while-revalidate=31536000',
                },
            }
        );
    } catch (err: unknown) {
        console.error('API Error: ', err);
        return NextResponse.json(
            { error: String(err), id: markdownKey },
            { status: 500 }
        );
    }
}
