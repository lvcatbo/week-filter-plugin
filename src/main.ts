import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/preflight.css"
import "@/assets/index.css"
import { i18n } from './local/index.ts'

createApp(App).use(i18n).mount('#app')
