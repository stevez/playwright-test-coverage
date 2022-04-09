import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test', 'coverage'],
        extension: [ '.js', '.ts', 'tsx', 'jsx' ],
        requireEnv: true
      }),
    ]
})