import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/index.ts',
        '**/index.tsx',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/coverage/**',
        '**/page.tsx',
        '**/layout.tsx',
        '**/*.config*',
        '**/i18n/**',
        '**/middleware.ts',
        '**/api/**',
        '**/common/**',
        '**/types.ts',
      ],
      reporter: ['text', 'html', 'lcov'],
      reportOnFailure: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
