import path from 'path';

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import smvp from 'speed-measure-vite-plugin';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `index.${format}.js`,
      name: 'centreon-ui-context'
    },
    sourcemap: true
  },
  define: {
    'process.env.DEBUG_PRINT_LIMIT': 10000
  },
  esbuild: {},
  plugins: smvp([
    dts({
      exclude: ['node_modules/**']
    }),
    splitVendorChunkPlugin()
  ])
});
