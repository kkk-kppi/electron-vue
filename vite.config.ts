import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import optimizer  from 'vite-plugin-optimizer'
// Electron comporess plugin
import { devPlugin, getReplacer } from './plugins/dev.plugin'
import { BuildPlugin } from './plugins/build.plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    optimizer(getReplacer()),
    devPlugin(),
    vue()
  ],
  server: {
    port: 9000,
    // proxy: {}
  },
  build: {
    rollupOptions: {
      plugins: [
        BuildPlugin()
      ]
    }
  }
})
