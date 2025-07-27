<script lang="ts">
	import { CldUploadWidget } from 'svelte-cloudinary';

	interface UploadedImage {
		publicId: string;
		secureUrl: string;
		format: string;
		width: number;
		height: number;
		uploadSource: 'unsigned' | 'signed'; // Track which widget uploaded this
		uploadedAt: Date; // Track when it was uploaded
		id: string; // Unique identifier for each upload
	}

	let uploadedImages = $state<UploadedImage[]>([]);
	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);

	function handleUnsignedUpload(results: any) {
		console.log('🔵 UNSIGNED widget triggered:', results);
		handleImageUpload(results, 'unsigned');
	}
	function handleImageUpload(results: any, source: 'unsigned' | 'signed') {
		const imageInfo = results.info;

		if (
			typeof imageInfo === 'object' &&
			imageInfo !== null &&
			'public_id' in imageInfo
		) {
			const newImage: UploadedImage = {
				publicId: imageInfo.public_id,
				secureUrl: imageInfo.secure_url,
				format: imageInfo.format,
				width: imageInfo.width,
				height: imageInfo.height,
				uploadSource: source,
				uploadedAt: new Date(),
				id: `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			};

			// Add to our state
			uploadedImages.push(newImage);

			// Clear any previous errors
			uploadError = null;

			console.log(
				`✅ Image uploaded via ${source.toUpperCase()} widget:`,
				newImage,
			);
		}
	}

	function handleUploadError(error: string, source: string) {
		uploadError = `${source}: ${error}`;
		console.error(`❌ Upload failed (${source}):`, error);
	}
</script>

<CldUploadWidget
	uploadPreset="svelte-cloudinary-unsigned"
	options={{
		multiple: false,
		sources: ['local', 'camera', 'url'],
		maxFiles: 1,
		clientAllowedFormats: ['image'],
		maxImageFileSize: 2000000, // 2MB
	}}
	onSuccess={handleUnsignedUpload}
	onError={(error) => handleUploadError(error, 'unsigned')}
	onQueuesStart={() => (isUploading = true)}
	onQueuesEnd={() => (isUploading = false)}>
	{#snippet children({ open, isLoading })}
		<button
			onclick={() => open()}
			disabled={isLoading || isUploading}
			class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded font-medium">
			{isUploading ? 'Uploading...' : isLoading ? 'Loading...' : 'Upload'}
		</button>
	{/snippet}
</CldUploadWidget>
