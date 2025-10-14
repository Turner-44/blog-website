import { S3Client } from '@aws-sdk/client-s3';
import { sdkClientConfig } from './shared';

export const s3Client = new S3Client(sdkClientConfig);

export const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
