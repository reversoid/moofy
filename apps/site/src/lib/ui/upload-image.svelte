<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn, makeClient } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		resource: 'collection' | 'user';
		imageUrl: string | null;
		children?: Snippet<[{ isLoading: boolean; imageUrl: string | null }]>;
		inputAttributes?: HTMLAttributes<HTMLInputElement>;
		class?: string;
	}

	let isLoading = $state(false);
	let {
		resource,
		imageUrl = $bindable(),
		children,
		inputAttributes,
		class: className
	}: Props = $props();

	// TODO props id
	const id = 'upload-image';

	async function uploadImage(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		isLoading = true;

		const formData = new FormData();
		formData.append('image', file);
		const api = makeClient(fetch);

		const result = await api.upload.image[':resource'].$post({
			form: { image: file },
			param: { resource }
		});

		if (!result.ok) {
			isLoading = false;
			toast.error('Не удалось загрузить изображение');

			return;
		}

		const { imageUrl: newImageUrl } = await result.json();
		imageUrl = newImageUrl;

		isLoading = false;
	}
</script>

<div class={cn('grid items-center', className)}>
	<Label
		for={id}
		class="flex-center flex flex-col items-center"
		onclick={() => document.getElementById(id)?.click()}
	>
		{@render children?.({ isLoading, imageUrl })}
	</Label>

	<Input
		accept="image/jpeg, image/png, image/webp, image/heic"
		disabled={isLoading}
		{id}
		class="hidden"
		type="file"
		onchange={uploadImage}
	/>
	<input type="hidden" value={imageUrl ?? ''} readonly {...inputAttributes} />
</div>
