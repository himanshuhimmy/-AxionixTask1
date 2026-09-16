import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5191,
    watch: {
      // json-server rewrites the whole file on every task/project mutation;
      // without this, Vite's dev server treats that as an unknown file change
      // and force-reloads the page on every single edit.
      ignored: ['**/db.json'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
