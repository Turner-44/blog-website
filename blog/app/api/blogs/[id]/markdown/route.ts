import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/app/lib/s3'

import { NextResponse } from 'next/dist/server/web/spec-extension/response'
import { BUCKET_NAME } from '@/app/lib/s3'

export async function POST(req: Request) {
    try {
        const reqData = await req.json()
        const markdownContent = reqData.markdownContent

        if (!markdownContent) {
            return NextResponse.json(
                { error: 'Markdown content is required' },
                { status: 400 }
            )
        }

        const markdownId = crypto.randomUUID()
        const markdownKey = `blog-posts/${reqData.blogId}/content/${markdownId}.md`

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: markdownKey,
                Body: Buffer.from(markdownContent),
                ContentType: 'text/markdown',
            })
        )
        return NextResponse.json(
            {
                ok: true,
                blogId: reqData.blogId,
                markdownId,
                markdownKey,
                s3Url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${markdownKey}`,
            },
            { status: 201 }
        )
    } catch (err: any) {
        console.error('POST /api/blogs/[id]/markdown error:', err)
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 }
        )
    }
}
