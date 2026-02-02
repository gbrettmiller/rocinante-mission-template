import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    // Use per-file runes mode - we use runes in our files,
    // but @xyflow/svelte uses legacy mode
    // runes: true // Disabled to allow mixing with legacy libraries
  },
}
