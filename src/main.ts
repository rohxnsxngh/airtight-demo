import { createApp } from 'vue'
import './theme/style.css'
import './theme/index.css'
import PrimeVue from 'primevue/config';
import router from "../src/router";
import App from './App.vue'

createApp(App).use(router).use(PrimeVue, {unstyled: true}).mount('#app')
