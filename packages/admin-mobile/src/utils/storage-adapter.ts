import { StorageHelper, createStorage } from '@shared/utils/storage';

class UniStorage implements Storage {
  [name: string]: any;
  length: number = 0;

  clear(): void {
    uni.clearStorageSync();
  }

  getItem(key: string): string | null {
    return uni.getStorageSync(key) || null;
  }

  key(_index: number): string | null {
    return null;
  }

  removeItem(key: string): void {
    uni.removeStorageSync(key);
  }

  setItem(key: string, value: string): void {
    uni.setStorageSync(key, value);
  }
}

const uniStorage = new UniStorage();

export const storage = createStorage({ storage: uniStorage as Storage });

export { StorageHelper, createStorage };
