import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	// Use vitePreprocess for TypeScript and other preprocessing
	preprocess: vitePreprocess(),
	
	// Astro-specific options
	compilerOptions: {
		// Enable hydration for interactive components
		hydratable: true,
		// Allow custom elements (useful for web components)
		customElement: false,
	},
	
	// Optional: Configure which file extensions to process
	extensions: ['.svelte'],
};

export default config;