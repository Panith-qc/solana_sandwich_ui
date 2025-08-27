import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// IMPORTANT for GitHub Pages:
// - base must match the repo name exactly: /solana_sandwich_ui/
// - dev-only proxy (Pages is static; no server/proxy in production)
export default defineConfig(({ mode }) => ({
  base: '/solana_sandwich_ui/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Only attach the proxy during local dev
  ...(mode === 'development' && {
    server: {
      proxy: {
        '/api/jupiter': {
          target: 'https://quote-api.jup.ag/v6',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/jupiter/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              proxyReq.setHeader('Origin', 'https://quote-api.jup.ag')
            })
          }
        }
      }
    }
  })
}))
