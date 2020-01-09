const fs = require('fs');
const path = require('path');

type CacheItem = {
  value: any;
  expires_at: number;
}

const getFilename = (
  key: string,
  namespace: string
): string => {
  return path.join('.', '.cache', namespace, key);
};

const isExpired = (
  item: CacheItem
): boolean => {
  if (item.expires_at === 0) {
    return false;
  }

  return item.expires_at < Date.now();
};

export const set = (
  key: string,
  value: any,
  expires_at: number = 0,
  namespace: string = 'default'
): void => {
  const filename = getFilename(key, namespace);
  const item: CacheItem = {
    value,
    expires_at
  };

  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(item));
};

export const get = (
  key: string,
  namespace: string = 'default'
): any | null => {
  const filename = getFilename(key, namespace);
  if (!fs.existsSync(filename)) {
    return null;
  }

  const raw = fs.readFileSync(filename);
  const item: CacheItem = JSON.parse(raw);

  if (isExpired(item)) {
    remove(key, namespace);
    return null;
  }

  return item.value;
};

export const remove = (
  key: string,
  namespace: string = 'default'
): void => {
  const filename = getFilename(key, namespace);
  if (!fs.existsSync(filename)) {
    return null;
  }

  fs.unlinkSync(filename);
};
