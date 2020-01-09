import { Home, HomeStatus } from "../schemas/home";
import * as Cache from "../cache";
import { requestHomesData, requestHomeStatus } from "../api";

export const MODULE_TYPE_RELAY = 'NAPlug';
export const MODULE_TYPE_THERMOSTAT = 'NATherm1';
export const MODULE_TYPE_VALVE = 'NRV';

const CACHE_HOMESDATA_KEY = 'homesdata';
const CACHE_HOMESDATA_EXPIRATION = 1000 * 60 * 60; // 1 hour
const CACHE_HOMESTATUS_KEY = 'homestatus';
const CACHE_HOMESTATUS_EXPIRATION = 1000 * 60; // 1 minute

const storeHomesDataInCache = (homes: Home[]) => {
  Cache.set(CACHE_HOMESDATA_KEY, homes, Date.now() + CACHE_HOMESDATA_EXPIRATION);
};

const loadHomesDataFromCache = (): Home[] | null => {
  return Cache.get(CACHE_HOMESDATA_KEY);
};

const loadHomesData = async (access_token: string): Promise<Home[]> => {
  let homes = loadHomesDataFromCache();

  if (homes) {
    return homes;
  }

  homes = await requestHomesData(access_token);
  storeHomesDataInCache(homes);

  return homes;
};

const storeHomeStatusInCache = (id: string, status: HomeStatus) => {
  Cache.set(CACHE_HOMESTATUS_KEY + '_' + id, status, Date.now() + CACHE_HOMESTATUS_EXPIRATION);
};

const loadHomeStatusFromCache = (id: string): HomeStatus | null => {
  return Cache.get(CACHE_HOMESTATUS_KEY + '_' + id);
};

const loadHomeStatus = async (id: string, access_token: string): Promise<HomeStatus> => {
  let status = loadHomeStatusFromCache(id);

  if (status) {
    return status;
  }

  status = await requestHomeStatus(id, access_token);
  storeHomeStatusInCache(id, status);

  return status;
};

export const getHomes = async (access_token: string): Promise<Home[]> => {
  const homes = await loadHomesData(access_token);

  for (let home of homes) {
    home.status = await loadHomeStatus(home.id, access_token);
  }

  return homes;
};
