import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    // Exclude PostCSS config from being loaded
    server: {
      deps: {
        inline: [],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // Prevent Vite from processing CSS imports
  esbuild: {
    target: 'node18',
  },
  // Exclude PostCSS config file from processing
  publicDir: false,
});
