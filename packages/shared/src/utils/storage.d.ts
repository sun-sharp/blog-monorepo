interface StorageOptions {
    prefixKey?: string;
    storage?: Storage;
}
declare class StorageHelper {
    protected _storage: Storage;
    protected _prefixKey?: string;
    constructor(options?: StorageOptions);
    protected getKey(key: string): string;
    set(key: string, value: any, expire?: number | null): void;
    get(key: string, def?: any): any;
    remove(key: string): void;
    clear(): void;
    setCookie(name: string, value: any, expire?: number | null): void;
    getCookie(name: string): string;
    removeCookie(key: string): void;
    clearCookie(): void;
}
export declare const createStorage: (options?: StorageOptions) => StorageHelper;
export declare const storage: StorageHelper;
export {};
//# sourceMappingURL=storage.d.ts.map