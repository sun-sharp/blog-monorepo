import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite 配置
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
})
