import { Capacitor } from '@capacitor/core';

const BASE_URL = Capacitor.isNativePlatform() ? 'http://192.168.50.54:3000' : '';

export const getApiUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};
