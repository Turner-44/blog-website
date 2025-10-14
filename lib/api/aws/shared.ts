export const sdkClientConfig = {
  credentials:
    process.env.ACCESS_KEY_ID_AWS && process.env.SECRET_ACCESS_KEY_AWS
      ? {
          accessKeyId: process.env.ACCESS_KEY_ID_AWS,
          secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
        }
      : undefined, // Let Amplify IAM role handle it
  region: process.env.REGION_AWS as string,
};
