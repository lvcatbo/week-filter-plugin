import { createApp } from 'vue'
import '@/assets/style.css'
import App from './App.vue'
import { i18n } from './local'

createApp(App).use(i18n).mount('#app')
