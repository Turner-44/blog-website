import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { sdkClientConfig } from './shared';

const secretId = 'becomingmatthew/nextauth';

interface AuthSecrets {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
}

export async function getAuthSecrets() {
  const client = new SecretsManagerClient(sdkClientConfig);

  const data = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );

  const parsed = JSON.parse(data.SecretString ?? '{}');

  console.log('Fetched auth secrets from AWS Secrets Manager');
  console.log(`Secret ID: ${parsed.GOOGLE_CLIENT_ID}`);
  console.log(`Secret ID: ${parsed.GOOGLE_CLIENT_SECRET}`);
  console.log(`Secret ID: ${parsed.NEXTAUTH_SECRET}`);

  return {
    GOOGLE_CLIENT_ID: parsed.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: parsed.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: parsed.NEXTAUTH_SECRET,
  };
}
