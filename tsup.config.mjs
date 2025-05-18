import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bot.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  outDir: 'dist',
})
