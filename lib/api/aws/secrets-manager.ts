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

export async function getAuthSecrets(): Promise<AuthSecrets> {
  const client = new SecretsManagerClient(sdkClientConfig);

  const data = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );

  const parsed = JSON.parse(data.SecretString ?? '{}');

  return {
    GOOGLE_CLIENT_ID: parsed.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: parsed.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: parsed.NEXTAUTH_SECRET,
  };
}
