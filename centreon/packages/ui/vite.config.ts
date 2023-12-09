import path from 'path';

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import smvp from 'speed-measure-vite-plugin';
import svgr from 'vite-plugin-svgr';
import istanbul from 'vite-plugin-istanbul';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: '/',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format}.js`,
      formats: ['umd'],
      name: 'centreon-ui'
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
      output: {
        globals: {
          react: 'React'
        }
      }
    },
    sourcemap: true
  },
  define: {
    'process.env.DEBUG_PRINT_LIMIT': 10000
  },
  esbuild: {},
  plugins: smvp(
    [
      svgr({
        svgrOptions: {
          icon: true,
          memo: true,
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                prefixIds: true
              }
            ]
          }
        }
      }),
      dts({
        exclude: ['node_modules/**', '**/*.stories.tsx']
      }),
      react(),
      splitVendorChunkPlugin(),
      !process.env.WITHOUT_NYC &&
        istanbul({
          cypress: true,
          exclude: ['node_modules', 'cypress/**/*.*', '**/*.js'],
          extension: ['.ts', '.tsx'],
          include: 'src/*',
          requireEnv: false
        })
    ].filter(Boolean)
  ),
  resolve: {
    alias: {
      '@centreon/ui/fonts': path.resolve(__dirname, '/fonts'),
      '@centreon/ui-context': path.resolve(__dirname, '..', 'ui-context', 'src')
    }
  },
  root: '.'
});
