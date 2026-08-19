import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dir = import.meta.dirname
const ROOT = path.resolve(__dir, '.')
const SRC = path.resolve(__dir, 'src')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': SRC,
      '@domain': path.resolve(SRC, 'domain'),
      '@application': path.resolve(SRC, 'application'),
      '@infra': path.resolve(SRC, 'infrastructure'),
      '@ui': path.resolve(SRC, 'presentation/components/ui'),
      '@presentation': path.resolve(SRC, 'presentation'),
      '@utils': path.resolve(SRC, 'presentation/utils'),
      '@constants': path.resolve(SRC, 'presentation/constants'),
      '@hooks': path.resolve(SRC, 'presentation/hooks'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: path.resolve(ROOT, 'dist'),
    sourcemap: true,
    target: 'es2020',
    cssMinify: 'esbuild',
    rollupOptions: {
        output: {
          manualChunks: (id: string): string | undefined => {
            if (id.includes('node_modules')) {
              if (id.match(/[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/)) {
                return 'react-vendor'
              }
              if (id.match(/[\\/]node_modules[\\/](react-hook-form|zod|@hookform\/resolvers)[\\/]/)) {
                return 'form-vendor'
              }
              return 'vendor'
            }
            return undefined
          },
        },
      },
  },
})
