import { OAuthTokens } from "../schemas/oauth";
import {
  requestAccessTokenUsingAuthorizationCode,
  requestAccessTokenUsingRefreshToken
} from "../api";
import * as Storage from "../storage";

const CACHE_OAUTH_KEY = 'oauth';

export type OAuthCredentials = {
  client_id: string;
  client_secret: string;
};

const isOAuthTokenExpired = (oauth: OAuthTokens): boolean => {
  return oauth.expires_at === null || oauth.expires_at < Date.now();
};

const loadAccessTokensFromStorage = (): OAuthTokens | null => {
  return Storage.get(CACHE_OAUTH_KEY);
};

const storeAccessTokensInStorage = (tokens: OAuthTokens): void => {
  Storage.set(CACHE_OAUTH_KEY, tokens);
};

const loadAccessTokens = async (credentials: OAuthCredentials): Promise<OAuthTokens> => {
  const tokens = loadAccessTokensFromStorage();

  if (null !== tokens && !isOAuthTokenExpired(tokens)) {
    return tokens;
  }

  if (null !== tokens && isOAuthTokenExpired(tokens)) {
    return await requestAccessTokenUsingRefreshToken({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: tokens.refresh_token,
    });
  }

  throw Error('No token in the storage');
};

export const requestNewAccessTokens = async (credentials: OAuthCredentials, code: string): Promise<void> => {
  const tokens = await requestAccessTokenUsingAuthorizationCode({
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    code: code,
  });

  tokens.expires_at = Date.now() + ((tokens.expires_in - 10) * 1000);

  storeAccessTokensInStorage(tokens);
};

export const getAccessTokens = async (credentials: OAuthCredentials): Promise<OAuthTokens> => {
  return await loadAccessTokens(credentials);
};
