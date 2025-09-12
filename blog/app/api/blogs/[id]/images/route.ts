import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/app/lib/s3'
import { NextResponse } from 'next/dist/server/web/spec-extension/response'
import { BUCKET_NAME } from '@/app/lib/s3'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const imageFile = formData.get('featureImage') as File

        if (!imageFile) {
            return NextResponse.json(
                { error: 'Feature image is required' },
                { status: 400 }
            )
        }

        const imageKey = `blog-posts/${formData.get('blogId')}/images/${formData.get('slug')}.png`

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: imageKey,
                Body: Buffer.from(await imageFile.arrayBuffer()),
                ContentType: imageFile.type,
            })
        )
        return NextResponse.json(
            {
                ok: true,
                blogId: formData.get('blogId'),
                slug: formData.get('slug'),
                imageKey,
                s3Url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`,
            },
            { status: 201 }
        )
    } catch (err: any) {
        console.error('POST /api/blogs/[id]/images error:', err)
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 }
        )
    }
}
