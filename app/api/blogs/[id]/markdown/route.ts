import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/app/lib/s3';

import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME } from '@/app/lib/s3';

export async function POST(req: Request) {
    try {
        const reqData = await req.json();
        const markdownContent = reqData.markdownContent;

        if (!markdownContent) {
            return NextResponse.json(
                { error: 'Markdown content is required' },
                { status: 400 }
            );
        }

        const markdownKey = `blog-posts/${reqData.blogId}/content/blog.md`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: markdownKey,
                Body: Buffer.from(markdownContent),
                ContentType: 'text/markdown',
            })
        );

        return NextResponse.json(
            {
                ok: true,
                blogId: reqData.blogId,
                markdownKey,
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('POST /api/blogs/[id]/markdown error:', err);
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const markdownKeysParam = url.searchParams.get('markdownKey');

    if (!markdownKeysParam) {
        return NextResponse.json(
            {
                error: `Missing markdownKey parameter`,
            },
            { status: 400 }
        );
    }

    const markdownKeys = markdownKeysParam.split(',');

    // Retrieve each image from S3
    const results = await Promise.all(
        markdownKeys.map(async (markdownKey, index) => {
            try {
                const command = new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: markdownKey,
                });
                const s3Res = await s3Client.send(command);

                if (!s3Res.Body) throw new Error('No markdown body returned');

                return {
                    content: await s3Res.Body.transformToString(),
                };
            } catch (err) {
                return {
                    id: markdownKey,
                    error: String(err),
                };
            }
        })
    );

    return NextResponse.json({ results });
}
