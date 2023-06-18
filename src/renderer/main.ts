// src/renderer/main.ts 是渲染进程的入口脚本
// index.html 引入该入口脚本

/* Style */
import './assets/style.css'
/* root component */
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')