<!-- 
  @component
  
	This component provides an API for rendering the Cloudinary Upload Widget.
	It won't render anything on it's own so must have a button nested
	which calls `open()`.

	@see https://svelte.cloudinary.dev/components/upload-widget

	@example Upload Widget

	```svelte
	<script>
		import { CldUploadWidget } from 'svelte-cloudinary';
	</script>

	<CldUploadWidget uploadPreset="<your upload preset>" let:open>
		<button on:click={open}>
			Open the widget
		</button>
	</CldUploadWidget>
	```
-->

<script lang="ts" module>
	import type {
		CloudinaryUploadWidgetOptions,
		CloudinaryUploadWidgetResults,
		CloudinaryUploadWidgetInstanceMethods,
		CloudinaryUploadWidget,
	} from '@cloudinary-util/types';
	import type { Snippet } from 'svelte';

	/**
	 * The event that fires when there is a widget related error
	 * @param error The error message
	 * @param options The widget instance methods and underlying widget
	 */
	export type CldUploadWidgetErrorEvent = (
		error: string,
		options: CloudinaryUploadWidgetInstanceMethods & {
			widget?: CloudinaryUploadWidget;
		},
	) => unknown;

	/**
	 * The event which fires on widget open
	 * @param widget The widget that opened
	 */
	export type CldUploadWidgetOpenEvent = (
		widget: CloudinaryUploadWidget,
	) => void;

	/**
	 * Generic Cloudinary upload widget event
	 * @param results The event results
	 * @param options The widget instance methods and underlying widget
	 */
	export type CldUploadWidgetGenericEvent = (
		results: CloudinaryUploadWidgetResults,
		options: CldUploadWidgetGenericEventOptions,
	) => unknown;

	/**
	 * The widget instance methods and underlying widget
	 */
	export type CldUploadWidgetGenericEventOptions = {
		widget: CloudinaryUploadWidget;
	} & CloudinaryUploadWidgetInstanceMethods;

	/**
	 * Use onSuccess instead. This will be removed in the next major release.
	 * @deprecated
	 */
	export type CldUploadWidgetUploadEvent = (
		results: CloudinaryUploadWidgetResults,
		widget: CloudinaryUploadWidget,
	) => void;

	/**
	 * Any upload widget event.
	 * @see https://svelte.cloudinary.dev/components/upload-widget#events
	 */
	export type CldUploadWidgetEvent =
		| CldUploadWidgetErrorEvent
		| CldUploadWidgetOpenEvent
		| CldUploadWidgetGenericEvent
		| CldUploadWidgetUploadEvent;

	export interface CldUploadWidgetProps {
		/**
		 * Overrides for the global Cloudinary config.
		 * @see https://svelte.cloudinary.dev/config
		 */
		config?: ConfigOptions;

		/**
		 * Upload Presets are configured on Cloudinary and provide a way to centrally define a set of upload options.
		 * @see https://cloudinary.com/documentation/upload_presets
		 */
		uploadPreset?: string;

		/**
		 * Signing requests is the recommended way to upload images as it provides enhanced security for your uploads.
		 */
		signatureEndpoint?: string;

		/**
		 * Options to customise and configure the upload widget.
		 */
		options?: CloudinaryUploadWidgetOptions;

		/**
		 * The snippet to render with widget methods exposed
		 */
		children: Snippet<
			[
				{
					widget: CloudinaryUploadWidget | undefined;
					cloudinary: typeof window.cloudinary | null;
					isLoading: boolean;
					open: (...args: any[]) => void;
					close: (...args: any[]) => void;
					destroy: (...args: any[]) => Promise<void>;
					hide: () => void;
					isDestroyed: () => boolean;
					isMinimized: () => boolean;
					isShowing: () => boolean;
					minimize: () => void;
					show: () => void;
					update: (...args: any[]) => void;
				},
			]
		>;

		/**
		 * Fires when an error occurs uploading.
		 */
		onError?: CldUploadWidgetErrorEvent;

		/**
		 * Fires when the widget is opened.
		 */
		onOpen?: CldUploadWidgetOpenEvent;

		/**
		 * Fires when the user aborted the upload.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#abort
		 */
		onAbort?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the uploading was cancelled.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#batch_cancelled
		 */
		onBatchCancelled?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the user closes the widget.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#close_event
		 */
		onClose?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the widget display type changes.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#display_changed
		 */
		onDisplayChanged?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the public id input field changes.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#publicid
		 */
		onPublicId?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when all files have finished uploading.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#queues_end
		 */
		onQueuesEnd?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the files are about to begin uploading.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#queues_start
		 */
		onQueuesStart?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the user retried after uploads failed.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#retry
		 */
		onRetry?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the user clicks the "Show Completed" button.
		 * Requires the showCompletedButton option be set to true.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#show_completed
		 */
		onShowCompleted?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the user selects a different upload source.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#source_changed
		 */
		onSourceChanged?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the upload has successfully completed.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#success
		 */
		onSuccess?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when the contents of the tags input field change.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#tags
		 */
		onTags?: CldUploadWidgetGenericEvent;

		/**
		 * Fires when a new file was selected to be uploaded.
		 * @see https://cloudinary.com/documentation/upload_widget_reference#upload_added
		 */
		onUploadAdded?: CldUploadWidgetGenericEvent;

		/**
		 * Use onSuccess instead. This will be removed in the next major release.
		 * @deprecated
		 */
		onUpload?: CldUploadWidgetUploadEvent;
	}
</script>

<script lang="ts">
	import { loadScript } from '../internal/scripts';
	import { mergeGlobalConfig } from '../config';
	import { onDestroy, onMount } from 'svelte';
	import {
		UPLOAD_WIDGET_EVENTS as _WIDGET_EVENTS,
		generateUploadWidgetResultCallback,
		generateSignatureCallback,
		getUploadWidgetOptions,
		type ConfigOptions,
	} from '@cloudinary-util/url-loader';

	interface Props extends CldUploadWidgetProps {}

	let {
		uploadPreset,
		signatureEndpoint,
		config,
		options = {},
		children,
		onError,
		onOpen,
		onAbort,
		onBatchCancelled,
		onClose,
		onDisplayChanged,
		onPublicId,
		onQueuesEnd,
		onQueuesStart,
		onRetry,
		onShowCompleted,
		onSourceChanged,
		onSuccess,
		onTags,
		onUploadAdded,
		onUpload,
	}: Props = $props();

	// Svelte 5 reactive state using runes
	let loaded = $state(
		typeof window != 'undefined' && !!window.cloudinary?.createUploadWidget,
	);

	let widget = $state<CloudinaryUploadWidget | undefined>(undefined);
	// Generate unique ID for each widget instance to prevent cross-contamination
	const widgetId = `widget_${Math.random().toString(36).substr(2, 9)}`;
	let isDestroyed = $state(false);

	// Create a stable reference to current widget instance
	let currentWidgetRef: { current: CloudinaryUploadWidget | undefined } = {
		current: undefined,
	};

	// Collect all event handlers into a single object for easier management
	const events = $derived({
		onError,
		onOpen,
		onAbort,
		onBatchCancelled,
		onClose,
		onDisplayChanged,
		onPublicId,
		onQueuesEnd,
		onQueuesStart,
		onRetry,
		onShowCompleted,
		onSourceChanged,
		onSuccess,
		onTags,
		onUploadAdded,
		onUpload,
	});

	const instanceMethods = {
		close: (...args: any[]) => currentWidgetRef.current?.close(...args),
		destroy: async (...args: any[]) => {
			if (currentWidgetRef.current && !isDestroyed) {
				isDestroyed = true;
				await currentWidgetRef.current?.destroy(...args);
				currentWidgetRef.current = undefined;
				widget = undefined;
			}
		},
		hide: () => currentWidgetRef.current?.hide(),
		isDestroyed: () =>
			(isDestroyed || currentWidgetRef.current?.isDestroyed()) ?? true,
		isMinimized: () => currentWidgetRef.current?.isMinimized() ?? false,
		isShowing: () => currentWidgetRef.current?.isShowing() ?? false,
		minimize: () => currentWidgetRef.current?.minimize(),
		show: () => currentWidgetRef.current?.show(),
		update: (...args: any[]) => currentWidgetRef.current?.update(...args),
		open: (...args: any[]) => {
			if (!currentWidgetRef.current || isDestroyed) {
				createWidget(config);
			}
			// Filter out any Event objects from the arguments to prevent DataCloneError
			const sanitizedArgs = args
				.map((arg) => {
					if (arg instanceof Event) {
						return undefined; // Remove event objects
					}
					return arg;
				})
				.filter((arg) => arg !== undefined);

			currentWidgetRef.current?.open(...sanitizedArgs);
			if (currentWidgetRef.current) {
				events.onOpen?.(currentWidgetRef.current);
			}
		},
	};

	const WIDGET_EVENTS = _WIDGET_EVENTS as Record<
		string,
		Exclude<
			Extract<keyof CldUploadWidgetProps, `on${string}`>,
			'onOpen' | 'onError' | 'onUpload'
		>
	>;

	function createWidget(config: Props['config']) {
		// Always destroy previous widget before creating new one
		if (currentWidgetRef.current && !isDestroyed) {
			instanceMethods.destroy();
		}

		const cfg = mergeGlobalConfig(config);

		const uploadOptions = getUploadWidgetOptions(
			{
				...options,
				uploadPreset: uploadPreset || cfg.extra.uploadPreset,
				uploadSignature:
					signatureEndpoint &&
					generateSignatureCallback({
						signatureEndpoint,
						fetch,
					}),
			},
			cfg.config,
		);

		// Create callback with proper closure isolation
		const callback = generateUploadWidgetResultCallback({
			onError: (error) => {
				// Only handle errors for THIS widget instance
				if (isDestroyed) return;

				const message = error
					? typeof error == 'string'
						? error
						: error?.statusText
					: 'Unknown Error';

				events.onError?.(message, {
					...instanceMethods,
					widget: currentWidgetRef.current!,
				});
			},
			onResult: (results) => {
				// Only handle results for THIS widget instance
				if (isDestroyed || !currentWidgetRef.current) return;

				if (typeof results?.event !== 'string') return;

				const options: CldUploadWidgetGenericEventOptions = {
					...instanceMethods,
					widget: currentWidgetRef.current,
				};

				const handlerName = WIDGET_EVENTS[`${results.event}`];

				switch (handlerName) {
					case 'onDisplayChanged':
						events.onDisplayChanged?.(results, options);

						if (results.info === 'hidden') {
							events.onClose?.(results, options);
						}
						break;

					case 'onSuccess':
						events.onSuccess?.(results, options);
						events.onUpload?.(results, options);
						break;

					default: {
						const handler = events[handlerName];
						handler?.(results, options);
						break;
					}
				}
			},
		});

		// Create widget and immediately assign to current reference
		const newWidget = window.cloudinary?.createUploadWidget?.(
			uploadOptions,
			callback,
		);

		if (newWidget) {
			currentWidgetRef.current = newWidget;
			widget = newWidget;
			isDestroyed = false;
		}
	}

	// Svelte 5 effect to handle config changes
	let previousConfig: typeof config;
	$effect(() => {
		if (
			loaded &&
			JSON.stringify(config) !== JSON.stringify(previousConfig)
		) {
			previousConfig = config;
			if (currentWidgetRef.current) {
				instanceMethods.destroy();
				createWidget(config);
			}
		}
	});

	// Computed cloudinary value
	let cloudinary = $derived((loaded && window.cloudinary) || null);

	onMount(() => {
		loadScript({
			src: 'https://upload-widget.cloudinary.com/global/all.js',
			onLoad() {
				loaded = true;
			},
			onError() {
				events.onError?.('Unable to load script', {
					...instanceMethods,
					widget: currentWidgetRef.current,
				});
			},
		});
	});

	onDestroy(() => {
		instanceMethods.destroy();
	});
</script>

{#if children}
	{@render children({
		widget,
		cloudinary,
		isLoading: !loaded,
		...instanceMethods,
	})}
{/if}
