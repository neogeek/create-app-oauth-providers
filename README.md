# @neogeek/create-app-oauth-providers

[![Tests](https://github.com/neogeek/create-app-oauth-providers/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/create-app-oauth-providers/actions/workflows/test.workflow.yml)
[![NPM version](https://img.shields.io/npm/v/@neogeek/create-app-oauth-providers?style=flat-square)](https://www.npmjs.org/package/@neogeek/create-app-oauth-providers)

## Install

```bash
$ npm install @neogeek/create-app-oauth-providers
```

## Usage

```typescript
import { google } from '@neogeek/create-app-oauth-providers';

import {
  GoogleOAuthProfileResponseSchema,
  GoogleOAuthTokenResponseSchema,
} from '@neogeek/create-app-oauth-providers/dist/providers/google';

(async () => {
  const code = req.query.code;

  const tokens = await google.getTokens(code, {
    client_id: process.env.GCP_OAUTH_CLIENT_ID,
    client_secret: process.env.GCP_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.GCP_OAUTH_REDIRECT_URL,
  });

  const validatedTokens = GoogleOAuthTokenResponseSchema.parse(tokens);

  const profile = await google.getProfile(tokens.access_token);

  const validatedProfile = GoogleOAuthProfileResponseSchema.parse(profile);

  console.log({ tokens, profile });
})();
```

### Types

```typescript
import type {
  GoogleOAuthProfileResponse,
  GoogleOAuthTokenResponse,
} from '@neogeek/create-app-oauth-providers/dist/providers/google';
```

### Schema (zod validation)

```typescript
import {
  GoogleOAuthProfileResponseSchema,
  GoogleOAuthTokenResponseSchema,
} from '@neogeek/create-app-oauth-providers/dist/providers/google';
```
