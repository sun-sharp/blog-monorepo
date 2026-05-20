import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src'),
      '/#': resolve(__dirname, '../shared/types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  define: {
    __APP_INFO__: JSON.stringify({
      pkg: {
        name: 'blog-admin-mobile',
        version: '1.0.0',
      },
      lastBuildTime: new Date().toISOString(),
    }),
  },
});
