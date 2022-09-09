const fs = require('fs');
const path = require('path');

type StorageItem = {
  value: any;
}

const getFilename = (
  key: string,
  namespace: string
): string => {
  return path.join('.', 'data', namespace, key);
};

export const set = (
  key: string,
  value: any,
  namespace: string = 'default'
): void => {
  const filename = getFilename(key, namespace);
  const item: StorageItem = {
    value,
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
  const item: StorageItem = JSON.parse(raw);

  return item.value;
};
