import { faker } from '@faker-js/faker';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { googleOAuthUrl, getTokens, refreshTokens, getProfile } from './utils';

const globalFetch = global.fetch;

describe('Google OAuth Utils', () => {
  beforeAll(() => {
    if (globalFetch === undefined) {
      global.fetch = async (): Promise<Response> =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as unknown as Response);
    }
  });
  afterAll(() => {
    global.fetch = globalFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('googleOAuthUrl', () => {
    expect(
      googleOAuthUrl('google-client-id', 'http://localhost:8080/oauth/google')
    ).toEqual(
      'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/oauth/google&client_id=google-client-id' +
        '&access_type=offline&response_type=code&prompt=consent&scope=https://www.googleapis.com/auth/userinfo.email'
    );
  });

  test('getTokens', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'access_token',
              expires_in: 1000,
              refresh_token: 'refresh_token',
            }),
        })
      )
    );

    await expect(
      getTokens('code', {
        client_id: 'client_id',
        client_secret: 'client_secret',
        redirect_uri: 'http://localhost:8080/oauth/google',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        access_token: 'access_token',
        expires_in: Date.now() + 1000 * 1000,
        refresh_token: 'refresh_token',
      })
    );
  });

  test('fail to getTokens', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
          json: () => Promise.resolve({}),
        })
      )
    );

    await expect(
      getTokens('code', {
        client_id: 'client_id',
        client_secret: 'client_secret',
        redirect_uri: 'http://localhost:8080/oauth/google',
      })
    ).rejects.toThrow(/unauthorized/i);
  });

  test('refreshTokens', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'access_token',
              expires_in: 1000,
            }),
        })
      )
    );

    await expect(
      refreshTokens('refresh_token', {
        client_id: 'client_id',
        client_secret: 'client_secret',
      })
    ).resolves.toEqual(
      expect.objectContaining({
        access_token: 'access_token',
        expires_in: Date.now() + 1000 * 1000,
      })
    );
  });

  test('fail to refreshTokens', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
          json: () => Promise.resolve({}),
        })
      )
    );

    await expect(
      refreshTokens('refresh_token', {
        client_id: 'client_id',
        client_secret: 'client_secret',
      })
    ).rejects.toThrow(/unauthorized/i);
  });

  test('getProfile', async () => {
    const emailAddress = faker.internet.email();

    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              email: emailAddress,
              picture: 'avatar.png',
            }),
        })
      )
    );

    await expect(getProfile('access_token')).resolves.toEqual(
      expect.objectContaining({
        email: emailAddress,
        picture: 'avatar.png',
      })
    );
  });

  test('fail to getProfile', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: StatusCodes.UNAUTHORIZED,
          statusText: ReasonPhrases.UNAUTHORIZED,
          json: () => Promise.resolve({}),
        })
      )
    );

    await expect(getProfile('access_token')).rejects.toThrow(/unauthorized/i);
  });
});
