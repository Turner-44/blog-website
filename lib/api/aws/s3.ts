import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID_AWS as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS as string,
  },
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
