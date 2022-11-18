import {
  GoogleOAuthProfileResponse,
  GoogleOAuthProfileResponseSchema,
  GoogleOAuthTokenResponse,
  GoogleOAuthTokenResponseSchema,
} from './types';

export const googleOAuthUrl = (client_id: string, redirect_uri: string) =>
  `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}&client_id=${client_id}` +
  `&access_type=offline&response_type=code&prompt=consent&scope=https://www.googleapis.com/auth/userinfo.email`;

export const getTokens = async (
  code: string,
  {
    client_id,
    client_secret,
    redirect_uri,
  }: { client_id: string; client_secret: string; redirect_uri: string }
): Promise<GoogleOAuthTokenResponse> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: JSON.stringify({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });

  const data = (await response.json()) as unknown;

  if (response.ok) {
    return GoogleOAuthTokenResponseSchema.parse(data);
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log(data);
  }

  throw new Error(`${response.status} ${response.statusText}`);
};

export const refreshTokens = async (
  refresh_token: string,
  { client_id, client_secret }: { client_id: string; client_secret: string }
): Promise<GoogleOAuthTokenResponse> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token,
      client_id,
      client_secret,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  const data = (await response.json()) as unknown;

  if (response.ok) {
    return GoogleOAuthTokenResponseSchema.parse(data);
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log(data);
  }

  throw new Error(`${response.status} ${response.statusText}`);
};

export const getProfile = async (
  access_token: string
): Promise<GoogleOAuthProfileResponse> => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      cache: 'no-store',
    }
  );

  const data = (await response.json()) as unknown;

  if (response.ok) {
    return GoogleOAuthProfileResponseSchema.parse(data);
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log(data);
  }

  throw new Error(`${response.status} ${response.statusText}`);
};
