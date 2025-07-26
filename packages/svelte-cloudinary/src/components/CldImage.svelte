<!--
	@component
	
	Renders an image from Cloudinary. It supports all of the regular <img>
	props, Cloudinary specific options, and options from unpic. This component
	wraps `@unpic/svelte` which brings high performance and responsive images.  
	
	@see https://svelte.cloudinary.dev/components/image

	@example Simple Image

	```svelte
	<script>
		import { CldImage } from 'svelte-cloudinary';
	</script>

	<CldImage
		height={150}
		width={150}
		src="path"
		alt="An awesome image from Cloudinary"
	/>
	```
-->

<script lang="ts" module>
	import type { ImageProps } from '@unpic/svelte';
	import type {
		ConfigOptions,
		ImageOptions,
	} from '@cloudinary-util/url-loader';

	export interface CldImageProps
		extends Omit<ImageOptions, 'width' | 'height'> {
		/**
		 * Overrides for the global Cloudinary config.
		 * @see https://svelte.cloudinary.dev/config
		 */
		config?: ConfigOptions;

		/**
		 * The target width of the image
		 */
		width: string | number;

		/**
		 * The target height of the image
		 */
		height: string | number;

		/**
		 * The source of the image (Cloudinary public ID or URL)
		 */
		src: string;

		/**
		 * Alt text for the image
		 */
		alt: string;

		/**
		 * Event handler for when image loads successfully
		 */
		onload?: (event: Event) => void;

		/**
		 * Event handler for when image fails to load
		 */
		onerror?: (event: Event) => void;

		/**
		 * Additional HTML img attributes
		 */
		[key: string]: any;
	}
</script>

<script lang="ts">
	import { pollForProcessingImage } from '@cloudinary-util/util';
	import { createLoader } from '../internal/loader';
	import { Image } from '@unpic/svelte';

	interface Props extends CldImageProps {}

	let { width, height, layout, onload, onerror, ...restProps }: Props =
		$props();

	// Create transformer using derived state
	let transformer = $derived(
		createLoader({ width, height, layout, ...restProps } as CldImageProps),
	);

	// Reactive key for forcing image updates
	let key = $state(0);

	async function handleError(event: Event) {
		console.warn(
			'[svelte-cloudinary]',
			'image failed to load, polling for updates',
		);

		const src = (event.target as HTMLImageElement | null)?.src;

		if (!src) {
			console.warn('[svelte-cloudinary]', 'unable to find the image src');
			return;
		}

		const result = await pollForProcessingImage({ src });

		if (result.success) {
			// Force image to update
			key++;
		} else {
			console.warn('[svelte-cloudinary] Failed to load image:', {
				src: restProps.src,
				error: result.error,
				status: result.status,
			});
		}

		// Call the original error handler if provided
		if (onerror) {
			onerror(event);
		}
	}

	function handleLoad(event: Event) {
		// Call the original load handler if provided
		if (onload) {
			onload(event);
		}
	}
</script>

{#key key}
	<Image
		transformer={(options) => transformer(options)}
		cdn="cloudinary"
		onload={handleLoad}
		onerror={handleError}
		width={+width}
		height={+height}
		{...restProps} />
{/key}
