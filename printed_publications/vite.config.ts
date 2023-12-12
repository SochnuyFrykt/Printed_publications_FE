import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const applicationNumber = 0

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: './build'
    },
    server: {
        port: 3000 + applicationNumber,
        proxy: {
            '/api': `http://localhost:500${applicationNumber}`,
            '/img': `http://localhost:500${applicationNumber}`,
        }
    }
})
