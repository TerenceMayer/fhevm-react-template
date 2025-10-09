import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@anonymous-art/fhevm-sdk']
  }
});
