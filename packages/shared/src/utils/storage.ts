const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

interface StorageOptions {
  prefixKey?: string;
  storage?: Storage;
}

class StorageHelper {
  protected _storage: Storage;
  protected _prefixKey?: string;

  constructor(options: StorageOptions = {}) {
    const { prefixKey = '', storage = localStorage } = options;
    this._storage = storage;
    this._prefixKey = prefixKey;
  }

  protected getKey(key: string): string {
    return `${this._prefixKey}${key}`.toUpperCase();
  }

  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME): void {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    });
    this._storage.setItem(this.getKey(key), stringData);
  }

  get(key: string, def: any = null): any {
    const item = this._storage.getItem(this.getKey(key));
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
        this.remove(this.getKey(key));
      } catch {
        return def;
      }
    }
    return def;
  }

  remove(key: string): void {
    this._storage.removeItem(this.getKey(key));
  }

  clear(): void {
    this._storage.clear();
  }

  setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
    document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
  }

  getCookie(name: string): string {
    const cookieArr = document.cookie.split('; ');
    for (let i = 0, length = cookieArr.length; i < length; i++) {
      const kv = cookieArr[i].split('=');
      if (kv[0] === this.getKey(name)) {
        return kv[1];
      }
    }
    return '';
  }

  removeCookie(key: string) {
    this.setCookie(key, 1, -1);
  }

  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        document.cookie = keys[i] + '=0;expire=' + new Date(0).toUTCString();
      }
    }
  }
}

export const createStorage = (options: StorageOptions = {}) => {
  return new StorageHelper(options);
};

export const storage = createStorage();
