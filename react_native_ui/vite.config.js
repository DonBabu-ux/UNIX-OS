import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    global: 'window',
    __DEV__: true,
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  plugins: [
    react({
      babel: {
        plugins: ['react-native-reanimated/plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry',
    },
    dedupe: ['react', 'react-dom'],
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-native-reanimated',
      'react-native-gesture-handler',
      'react-native-svg',
    ],
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
      loader: {
        '.js': 'tsx',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 5173,
  },
});
