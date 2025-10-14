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

const client = new SecretsManagerClient(sdkClientConfig);
let cachedSecrets: AuthSecrets | null = null;

export async function getAuthSecrets() {
  if (cachedSecrets) return cachedSecrets;

  const data = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );

  const parsed = JSON.parse(data.SecretString ?? '{}');

  cachedSecrets = {
    GOOGLE_CLIENT_ID: parsed.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: parsed.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: parsed.NEXTAUTH_SECRET,
  };

  return cachedSecrets;
}
