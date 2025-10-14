import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  credentials:
    process.env.ACCESS_KEY_ID_AWS && process.env.SECRET_ACCESS_KEY_AWS
      ? {
          accessKeyId: process.env.ACCESS_KEY_ID_AWS,
          secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
        }
      : undefined, // Let Amplify IAM role handle it
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
