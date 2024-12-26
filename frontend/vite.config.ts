import { Alias, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfig from './tsconfig.json';
import path from 'path';

const ReactCompilerConfig = {
  target: '19'
};

export function resolvePathsToAlias(): Alias[] {
  const { paths } = tsconfig.compilerOptions;

  return Object.keys(paths)
    .map((item) => {
      const key = item.replace('/*', '');
      const value = path.join(
        __dirname,
        paths[item][0].replace('/*', '').replace('*', '')
      );

      return { find: key, replacement: value };
    })
    .filter(i => i !== null)
    .filter((i, j, s) => s.indexOf(i) === j);
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', ReactCompilerConfig]
        ]
      }
    })],
    root: 'src',
    publicDir: '../public',
    build: {
      outDir: '../build',
      assetsDir: '.',
      emptyOutDir: true
    },
    resolve: {
      alias: resolvePathsToAlias()
    },
    server: {
      port: 8082,
      proxy: {
        '/api': {
          target: 'http://localhost:8080'
        },
        '/ws': {
          target: 'ws://localhost:8080',
          ws: true
        }
      }
    },
    define: {
      APPLICATION_VERSION: `"${env.APPLICATION_VERSION ?? ''}"`,
      API_URL: `"${env.API_URL ?? 'localhost:8080'}"`
    }
  };
});
