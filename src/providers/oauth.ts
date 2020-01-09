import { OAuthTokens } from "../schemas/oauth";
import { requestAccessTokenUsingPassword, requestAccessTokenUsingRefreshToken } from "../api";
import * as Cache from "../cache";

const CACHE_OAUTH_KEY = 'oauth';

export type OAuthCredentials = {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
};

const isOAuthTokenExpired = (oauth: OAuthTokens): boolean => {
  return oauth.expires_at === null || oauth.expires_at < Date.now();
};

const loadAccessTokensFromCache = (): OAuthTokens | null => {
  return Cache.get(CACHE_OAUTH_KEY);
};

const storeAccessTokensInCache = (tokens: OAuthTokens): void => {
  Cache.set(CACHE_OAUTH_KEY, tokens);
};

const loadAccessTokens = async (credentials: OAuthCredentials): Promise<OAuthTokens> => {
  const tokens = loadAccessTokensFromCache();

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

  return await requestAccessTokenUsingPassword(credentials);
};

export const getAccessTokens = async (credentials: OAuthCredentials): Promise<OAuthTokens> => {
  const tokens = await loadAccessTokens(credentials);

  if (!tokens.expires_at) {
    tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
  }

  storeAccessTokensInCache(tokens);

  return tokens;
};
