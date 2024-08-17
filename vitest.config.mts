/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    environment: 'node',
    reporters: 'verbose',
    fileParallelism: false,
    globals: true,
  },
});
