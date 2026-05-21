import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src'),
      '/#': resolve(__dirname, '../shared/types'),
      'vue': resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js'),
    },
    dedupe: ['vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 7222,
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
});
