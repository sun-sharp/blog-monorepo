declare global {
  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;

  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface UniEnv {
    VITE_APP_TITLE: string;
    VITE_CAPITAL_API_URL: string;
    VITE_BLOG_API_URL: string;
    VITE_APP_SHORT_NAME: string;
    VITE_AUTHORIZATION_HEAD?: string;
    VITE_BASE_URL: string;
  }
}

export {};
