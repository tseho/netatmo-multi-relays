import fetch, { RequestInit, Response } from 'node-fetch';
import { stringify } from 'query-string';
import { OAuthTokens } from "./schemas/oauth";
import logger from "./logger";

const BASE_URL = 'https://api.netatmo.com';

const request = async (url: string, options: RequestInit = {}): Promise<any> => {
  logger.debug('API request', { url, method: options.method || 'GET' });

  const response = await fetch(url, options);
  await handleServerError(response);

  return await response.json();
};

const getServerErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.error.message;
  } catch (e) {
    return response.statusText;
  }
};

const handleServerError = async (response: Response) => {
  if (!response.ok) {
    throw Error(await getServerErrorMessage(response));
  }
};

export const requestAccessTokenUsingPassword = async (
  {
    client_id,
    client_secret,
    username,
    password,
  }: {
    client_id: string,
    client_secret: string,
    username: string,
    password: string,
  }
): Promise<OAuthTokens> => {
  return await request(BASE_URL + '/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: stringify({
      grant_type: 'password',
      scope: 'read_thermostat write_thermostat',
      client_id,
      client_secret,
      username,
      password,
    })
  });
};

export const requestAccessTokenUsingRefreshToken = async (
  {
    client_id,
    client_secret,
    refresh_token,
  }: {
    client_id: string,
    client_secret: string,
    refresh_token: string,
  }
): Promise<OAuthTokens> => {
  return await request(BASE_URL + '/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: stringify({
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      refresh_token,
    })
  });
};

export const requestHomesData = async (access_token: string) => {
  const response = await request(BASE_URL + '/api/homesdata', {
    headers: {
      'Authorization': 'Bearer ' + access_token,
    },
  });

  return response.body.homes;
};

export const requestHomeStatus = async (id: string, access_token: string) => {
  const response = await request(BASE_URL + '/api/homestatus?' + stringify({
    'home_id': id,
  }), {
    headers: {
      'Authorization': 'Bearer ' + access_token,
    },
  });

  return response.body.home;
};

type roomThermPointQuery = {
  home_id: string,
  room_id: string,
  mode: string,
  temp?: number,
  endtime?: string,
};

export const setRoomThermPoint = async (
  query: {
    home_id: string,
    room_id: string,
    mode: string,
    temp?: number,
    endtime?: string,
  },
  access_token: string
): Promise<boolean> => {
  const response = await request(BASE_URL + '/api/setroomthermpoint', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: stringify(query)
  });

  return response.status === 'ok';
};
