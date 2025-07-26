<script lang="ts">
	import { CldUploadWidget, CldImage } from 'svelte-cloudinary';

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

	// Separate handlers to test widget isolation
	function handleUnsignedUpload(results: any) {
		console.log('🔵 UNSIGNED widget triggered:', results);
		handleImageUpload(results, 'unsigned');
	}

	function handleSignedUpload(results: any) {
		console.log('🟢 SIGNED widget triggered:', results);
		handleImageUpload(results, 'signed');
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

	function removeImage(index: number) {
		uploadedImages.splice(index, 1);
	}

	// Get count by source for debugging
	let unsignedCount = $derived(
		uploadedImages.filter((img) => img.uploadSource === 'unsigned').length,
	);
	let signedCount = $derived(
		uploadedImages.filter((img) => img.uploadSource === 'signed').length,
	);
</script>

<div class="mb-6">
	<h2 class="text-xl font-bold mb-4">Widget Isolation Test</h2>
	<div class="bg-blue-50 p-4 rounded mb-4">
		<p class="text-sm text-blue-800">
			<strong>Testing:</strong> Upload using different widgets and verify each
			widget only triggers its own callback.
		</p>
		<div class="mt-2 text-sm">
			<span class="inline-block bg-blue-200 px-2 py-1 rounded mr-2">
				🔵 Unsigned: {unsignedCount} uploads
			</span>
			<span class="inline-block bg-green-200 px-2 py-1 rounded">
				🟢 Signed: {signedCount} uploads
			</span>
		</div>
	</div>
</div>

<div class="w-full max-w-4xl bg-slate-800 p-4 rounded mb-6">
	{#if uploadedImages.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each uploadedImages as img, index}
				<div class="relative group">
					<CldImage
						src={img.secureUrl}
						width="200"
						height="200"
						alt="uploaded image"
						class="rounded object-cover" />
					<div class="absolute top-2 left-2">
						<span
							class="inline-block px-2 py-1 rounded text-xs font-bold {img.uploadSource ===
							'unsigned'
								? 'bg-blue-500 text-white'
								: 'bg-green-500 text-white'}">
							{img.uploadSource === 'unsigned' ? '🔵' : '🟢'}
							{img.uploadSource.toUpperCase()}
						</span>
					</div>
					<div
						class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							onclick={() => removeImage(index)}
							class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
							✕
						</button>
					</div>
					<div
						class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<div>ID: {img.id}</div>
						<div>Time: {img.uploadedAt.toLocaleTimeString()}</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-white text-center py-8">
			No images uploaded yet. Use the buttons below to test widget
			isolation.
		</div>
	{/if}
</div>

{#if uploadError}
	<div
		class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
		<strong>Error:</strong>
		{uploadError}
	</div>
{/if}

<div class="flex items-center gap-4 flex-wrap">
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
				🔵 {isUploading
					? 'Uploading...'
					: isLoading
						? 'Loading...'
						: 'Upload Unsigned'}
			</button>
		{/snippet}
	</CldUploadWidget>

	<CldUploadWidget
		uploadPreset="svelte-cloudinary-signed"
		signatureEndpoint="/api/sign-cloudinary-params"
		options={{
			multiple: true,
			sources: ['local', 'camera', 'url'],
			clientAllowedFormats: ['image'],
		}}
		onSuccess={handleSignedUpload}
		onError={(error) => handleUploadError(error, 'signed')}
		onQueuesStart={() => (isUploading = true)}
		onQueuesEnd={() => (isUploading = false)}>
		{#snippet children({ open, isLoading })}
			<button
				onclick={() => open()}
				disabled={isLoading || isUploading}
				class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded font-medium">
				🟢 {isUploading
					? 'Uploading...'
					: isLoading
						? 'Loading...'
						: 'Upload Signed'}
			</button>
		{/snippet}
	</CldUploadWidget>

	<button
		onclick={() => (uploadedImages = [])}
		class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium">
		🗑️ Clear All
	</button>
</div>

<div class="mt-6 text-sm text-gray-600">
	<h3 class="font-semibold mb-2">How to test widget isolation:</h3>
	<ol class="list-decimal list-inside space-y-1">
		<li>Click "🔵 Upload Unsigned" and upload an image</li>
		<li>
			Check console logs - should only see "🔵 UNSIGNED widget triggered"
		</li>
		<li>Click "🟢 Upload Signed" and upload an image</li>
		<li>
			Check console logs - should only see "🟢 SIGNED widget triggered"
		</li>
		<li>
			Verify each image shows correct color badge (🔵 for unsigned, 🟢 for
			signed)
		</li>
		<li>
			If widgets leak, you'll see both callbacks triggered for a single
			upload
		</li>
	</ol>
</div>
