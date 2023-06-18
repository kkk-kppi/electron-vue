import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Electron comporess plugin
import { devPlugin } from './plugins/dev.plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9000,
    // proxy: {}
  },
  plugins: [
    devPlugin(),
    vue()
  ]
})
