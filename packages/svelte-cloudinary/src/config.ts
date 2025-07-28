import { VERSION as SVELTE_CLOUDINARY_VERSION } from './version';
import { VERSION as SVELTE_VERSION } from 'svelte/compiler';
import { setContext, getContext } from 'svelte';
import { klona } from './internal/klona';
import { defu } from 'defu';
import { BROWSER } from 'esm-env';
import type {
	AnalyticsOptions,
	ConfigOptions,
} from '@cloudinary-util/url-loader';

const STORE_KEY = 'svelte-cloudinary-v2-config';

function normaliseVersion(version: string) {
	return version.includes('-') ? version.split('-')[0] : version;
}

export const DEFAULT_ANALYTICS: AnalyticsOptions = Object.freeze({
	techVersion: normaliseVersion(SVELTE_VERSION),
	sdkSemver: normaliseVersion(SVELTE_CLOUDINARY_VERSION),
	sdkCode: 'E',
	product: 'B',
	feature: '',
});

export interface GlobalCloudinaryConfig extends ConfigOptions {
	analytics?: AnalyticsOptions;
	uploadPreset?: string;
	cloudName?: string;
	apiKey?: string;
}

// Helper function to safely get environment variables
function getEnvVar(key: string): string | undefined {
	if (BROWSER) {
		// In browser, try to get from window or globalThis
		const globalEnv = (globalThis as any).__ENV__ || (window as any).__ENV__;
		return globalEnv?.[key];
	}
	
	// In Node.js/SSR
	if (typeof process !== 'undefined' && process.env) {
		return process.env[key];
	}
	
	// Fallback: try import.meta.env if available (Vite)
	try {
		return (import.meta as any).env?.[key];
	} catch {
		return undefined;
	}
}

function getEnvConfig() {
	return {
		cloud: {
			cloudName:
				getEnvVar('VITE_CLOUDINARY_CLOUD_NAME') ||
				getEnvVar('VITE_PUBLIC_CLOUDINARY_CLOUD_NAME') ||
				getEnvVar('CLOUDINARY_CLOUD_NAME') ||
				getEnvVar('PUBLIC_CLOUDINARY_CLOUD_NAME'),
			apiKey:
				getEnvVar('VITE_CLOUDINARY_API_KEY') ||
				getEnvVar('VITE_PUBLIC_CLOUDINARY_API_KEY') ||
				getEnvVar('CLOUDINARY_API_KEY') ||
				getEnvVar('PUBLIC_CLOUDINARY_API_KEY'),
		},
		url: {
			privateCdn: !!(
				getEnvVar('VITE_CLOUDINARY_PRIVATE_CDN') ||
				getEnvVar('CLOUDINARY_PRIVATE_CDN')
			),
			secureDistribution:
				getEnvVar('VITE_CLOUDINARY_SECURE_DISTRIBUTION') ||
				getEnvVar('CLOUDINARY_SECURE_DISTRIBUTION'),
		},
		extra: {
			uploadPreset:
				getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET') ||
				getEnvVar('CLOUDINARY_UPLOAD_PRESET'),
		},
	};
}

export function mergeGlobalConfig(
	configOverride?: ConfigOptions,
	analyticsOverride?: AnalyticsOptions,
) {
	const globalConfig = getGlobalConfig();
	const envConfig = getEnvConfig();

	const config = defu(
		// Overrides have the highest priorty
		klona(configOverride),

		// Merge the global config `cloudName` and `apiKey`
		{
			cloud: {
				cloudName: globalConfig?.cloudName,
				apiKey: globalConfig?.apiKey,
			},
		},
		// Merge the global config `cloud` and `url` properties
		{ cloud: globalConfig?.cloud, url: globalConfig?.url },
		// Merge the environment variables
		{ cloud: envConfig.cloud, url: envConfig.url },
	) as ConfigOptions;

	const analytics = defu(
		// Overrides have the highest priorty
		klona(analyticsOverride),
		// Merge the global config analytics
		globalConfig?.analytics,
		// Merge the default analytics
		DEFAULT_ANALYTICS,
	) as AnalyticsOptions;

	const extra = defu(
		{ uploadPreset: globalConfig?.uploadPreset },
		envConfig.extra,
	);

	return {
		config,
		analytics,
		extra,
	};
}

/**
 * This can be used to configure cloudinary in your Svelte components.
 * This should be used when you can't use environment variables, or they don't
 * support a config option you need.
 *
 * @see https://svelte.cloudinary.dev/config
 *
 * @example
 *
 * <script>
 *   import { configureCloudinary } from 'svelte-cloudinary';
 *
 *   configureCloudinary({
 *     cloudName: 'cloudName',
 *   });
 * </script>
 */
export function configureCloudinary(globalConfig: GlobalCloudinaryConfig) {
	setContext<GlobalCloudinaryConfig>(STORE_KEY, klona(globalConfig));
}

export function getGlobalConfig(): GlobalCloudinaryConfig | null {
	try {
		const config = getContext<GlobalCloudinaryConfig>(STORE_KEY);
		return config ?? null;
	} catch (error) {
		return null;
	}
}
