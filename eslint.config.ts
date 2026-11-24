import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  typescript: true,
  /**
   * Auto-detection walks up to ~/pnpm-workspace.yaml and turns on pnpm catalog rules,
   * which stall on package.json in this bun-managed repo.
   */
  pnpm: false,
  ignores: ['docs/**', '.firecrawl/**', '.superpowers/**'],
})
