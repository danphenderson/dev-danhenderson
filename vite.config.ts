import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const DEFAULT_DEV_PORT = 3001;

const normalizePublicUrl = (value: string | undefined): string => {
  if (!value || value === '/') {
    return '';
  }

  return value.replace(/\/+$/, '');
};

const resolveViteBase = (publicUrl: string): string => (publicUrl ? `${publicUrl}/` : '/');

const resolveManualChunk = (id: string) => {
  if (id.includes('/src/data/climbs.ts')) {
    return 'climbing-data';
  }

  if (id.includes('/node_modules/@mui/x-data-grid/')) {
    return 'vendor-data-grid';
  }

  if (id.includes('/node_modules/fuse.js/')) {
    return 'vendor-fuse';
  }

  return undefined;
};

const createPublicUrlHtmlTransformPlugin = (publicUrl: string): Plugin => ({
  name: 'public-url-html-transform',
  transformIndexHtml(html) {
    return html.replace(/__PUBLIC_URL__/g, publicUrl);
  },
});

const createInjectedAppEnvironment = (mode: string, publicUrl: string) => ({
  PUBLIC_URL: publicUrl,
  NODE_ENV: mode === 'production' ? 'production' : 'development',
  REACT_APP_RUNTIME_ENV: process.env.REACT_APP_RUNTIME_ENV,
  REACT_APP_ENABLE_GITHUB_API_IN_DEV: process.env.REACT_APP_ENABLE_GITHUB_API_IN_DEV,
  REACT_APP_GIT_SHA: process.env.REACT_APP_GIT_SHA,
  REACT_APP_BUILD_TIME: process.env.REACT_APP_BUILD_TIME,
  REACT_APP_VERSION: process.env.REACT_APP_VERSION,
});

export default defineConfig(({ mode }) => {
  const publicUrl = normalizePublicUrl(process.env.PUBLIC_URL);

  return {
    plugins: [react(), createPublicUrlHtmlTransformPlugin(publicUrl)],
    publicDir: 'public',
    base: resolveViteBase(publicUrl),
    server: {
      port: Number(process.env.PORT ?? DEFAULT_DEV_PORT),
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: resolveManualChunk,
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(createInjectedAppEnvironment(mode, publicUrl)),
    },
  };
});
