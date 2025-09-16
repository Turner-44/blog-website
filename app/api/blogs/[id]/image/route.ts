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

        const imageKey = `blog-posts/${formData.get('blogId')}/image/${formData.get('slug')}.png`;

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
                blogId: formData.get('blogId'),
                slug: formData.get('slug'),
                imageKey,
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('API Error: ', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);

    const imageKey = url.searchParams.get('imageKey');

    if (!imageKey) {
        return NextResponse.json({
            error: `Missing imageKey parameter`,
            status: 400,
        });
    }

    if (typeof imageKey !== 'string') {
        return NextResponse.json({
            error: `imageKey must be a string`,
            status: 400,
        });
    }

    try {
        const s3Res = await s3Client.send(
            new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: imageKey,
            })
        );

        if (!s3Res.Body) {
            return NextResponse.json({
                error: 'No image found',
                status: 404,
            });
        }

        const arrayBuffer = await s3Res.Body.transformToByteArray();

        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        return NextResponse.json({
            id: imageKey,
            image: base64Image,
        });
    } catch (err) {
        console.error('API Error: ', err);
        return NextResponse.json({
            error: String(err),
            status: 500,
        });
    }
}
