const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

class StorageHelper {
  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME): void {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    });
    uni.setStorageSync(key, stringData);
  }

  get(key: string, def: any = null): any {
    const item = uni.getStorageSync(key);
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
        this.remove(key);
      } catch {
        return def;
      }
    }
    return def;
  }

  remove(key: string): void {
    uni.removeStorageSync(key);
  }

  clear(): void {
    uni.clearStorageSync();
  }
}

export const storage = new StorageHelper();
