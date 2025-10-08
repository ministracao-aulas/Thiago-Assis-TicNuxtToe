import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    app: {
        head: {
            title: 'Tic-Tac-Toe',
            meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
        },
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],

    vite: {
        plugins: [tailwindcss()],
    },
});
