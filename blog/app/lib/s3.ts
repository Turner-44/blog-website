import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY as string,
    },
})

export const BUCKET_NAME = process.env.S3_BUCKET_NAME as string
