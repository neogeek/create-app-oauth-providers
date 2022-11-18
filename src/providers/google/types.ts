import { z } from 'zod';

export const GoogleOAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().transform(val => Date.now() + val * 1000),
  refresh_token: z.string().optional(),
});

export type GoogleOAuthTokenResponse = z.infer<
  typeof GoogleOAuthTokenResponseSchema
>;

export const GoogleOAuthProfileResponseSchema = z.object({
  email: z.string(),
  picture: z.string(),
});

export type GoogleOAuthProfileResponse = z.infer<
  typeof GoogleOAuthProfileResponseSchema
>;
