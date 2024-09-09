import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/main.jsx'
      }
    },
    emptyOutDir: false  // Ensure Vite does not delete files in the `dist` directory
  }
});