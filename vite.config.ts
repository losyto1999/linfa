import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rolldownOptions: {
            output: {
                // Le librerie in file a parte: nessun file supera i 500 kB e restano in cache
                // del browser quando cambia solo il codice del sito.
                codeSplitting: {
                    groups: [
                        { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
                        { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
                        { name: 'vendor', test: /node_modules[\\/]/ },
                    ],
                },
            },
        },
    },
})
