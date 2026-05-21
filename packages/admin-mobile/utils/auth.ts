import { ACCESS_TOKEN } from '../../shared/src/constants/storage-name';
import { storage } from './storage';

export function getToken(): string {
  return storage.get(ACCESS_TOKEN, '');
}

export function setToken(token: string): void {
  storage.set(ACCESS_TOKEN, token);
}

export function removeToken(): void {
  storage.remove(ACCESS_TOKEN);
}
