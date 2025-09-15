import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/app/lib/s3';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { BUCKET_NAME } from '@/app/lib/s3';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('featureImage') as File;

        if (!imageFile) {
            return NextResponse.json(
                { error: 'Feature image is required' },
                { status: 400 }
            );
        }

        const imageKey = `blog-posts/${formData.get('blogId')}/images/${formData.get('slug')}.png`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: imageKey,
                Body: Buffer.from(await imageFile.arrayBuffer()),
                ContentType: imageFile.type,
            })
        );
        return NextResponse.json(
            {
                ok: true,
                blogId: formData.get('blogId'),
                slug: formData.get('slug'),
                imageKey,
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('POST /api/blogs/[id]/images error:', err);
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);

    const imageKeysParam = url.searchParams.get('imageKey');

    if (!imageKeysParam) {
        return NextResponse.json(
            {
                error: `Missing imageKey parameter`,
            },
            { status: 400 }
        );
    }

    const imageKeys = imageKeysParam.split(',');

    // Retrieve each image from S3
    const results = await Promise.all(
        imageKeys.map(async (imageKey, index) => {
            try {
                const command = new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: imageKey,
                });
                const s3Res = await s3Client.send(command);
                if (!s3Res.Body) throw new Error('No image body returned');

                const arrayBuffer = await s3Res.Body.transformToByteArray();
                // Return as base64 or buffer
                return {
                    id: imageKey,
                    image: Buffer.from(arrayBuffer).toString('base64'),
                };
            } catch (err) {
                return {
                    id: imageKey,
                    error: String(err),
                };
            }
        })
    );

    return NextResponse.json({ results });
}
