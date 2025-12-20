import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        all: true,
        include: ['src/**/*.vue', 'src/**/*.ts'],
        exclude: ['**/*.spec.ts', 'node_modules/', 'main.ts', 'vue-test-utils.d.ts', 'router/**', 'src/types/**'],
      },
      include: ['**/*.spec.ts'],
      exclude: [
        './dist/**',
        'node_modules',
      ],
      setupFiles: ['./vitest.setup.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      deps: {
        optimizer: {
          web: {
            // https://github.com/vitest-dev/vitest/issues/4074
            exclude: ['vue'],
          },
        },
      },
    },
  }),
)
