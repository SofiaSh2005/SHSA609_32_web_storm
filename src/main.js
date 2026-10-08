import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import { createPinia } from 'pinia';
import router from '@/router.js';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import 'primeicons/primeicons.css';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';



const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('Toast', Toast);
app.component('ConfirmPopup', ConfirmPopup);

app.use(ToastService);
app.use(ConfirmationService);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

app.mount('#app');
