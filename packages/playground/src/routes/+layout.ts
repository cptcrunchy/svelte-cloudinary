import { createHighlighterCore } from 'shiki/core';
import serendipity from '$lib/code/serendipity';
import svelte from 'shiki/langs/svelte.mjs';
import getWasm from 'shiki/wasm';
import type { HighlighterCore } from 'shiki/core';

// Cache the highlighter instance globally
let cachedHighlighter: HighlighterCore | null = null;

async function getHighlighter(): Promise<HighlighterCore> {
	if (!cachedHighlighter) {
		cachedHighlighter = await createHighlighterCore({
			loadWasm: getWasm,
			langs: [svelte],
			themes: [serendipity],
		});
	}
	return cachedHighlighter;
}

export async function load() {
	return {
		highlighter: await getHighlighter(),
	};
}