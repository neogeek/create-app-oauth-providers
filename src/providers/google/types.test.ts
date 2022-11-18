import { GoogleOAuthTokenResponseSchema } from './types';

describe('OAuth Types', () => {
  test('convert expires_in from seconds to timestamp', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const data = {
      access_token: 'access_token',
      expires_in: 1000,
      refresh_token: 'refresh_token',
    };

    expect(GoogleOAuthTokenResponseSchema.parse(data)).toEqual({
      access_token: 'access_token',
      expires_in: Date.now() + data.expires_in * 1000,
      refresh_token: 'refresh_token',
    });
  });
});
