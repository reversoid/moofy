<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import UploadCollectionImage from './upload-collection-image.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import DeleteButton from '$lib/ui/delete-button.svelte';
	import { IconDeviceFloppy, IconPencil } from '@tabler/icons-svelte';

	type CollectionModalProps = {
		type: 'create' | 'edit';
		onSubmit: (props: {
			name: string;
			description: string | null;
			isPublic: boolean;
			imageUrl: string | null;
		}) => Promise<void>;
	};

	const { type, onSubmit }: CollectionModalProps = $props();

	let name = $state('');
	let description = $state(null);
	let isPrivate = $state(false);
	let imageUrl = $state(null);

	let isLoading = $state(false);

	async function onSubmitWithLoading(props: Parameters<CollectionModalProps['onSubmit']>[0]) {
		isLoading = true;
		await onSubmit(props);
		isLoading = false;
	}
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать коллекцию' : 'Изменить коллекцию'}</Dialog.Title>
	<Dialog.Description>Коллекции позволяют группировать фильмы</Dialog.Description>
</Dialog.Header>

<div class="mt-2">
	<form
		id="collection-form"
		class="flex flex-col gap-5"
		onsubmit={() => onSubmitWithLoading({ name, description, isPublic: !isPrivate, imageUrl })}
	>
		<div class="flex flex-col gap-3">
			<Label for="name">Название коллекции</Label>
			<Input id="name" placeholder="Название" bind:value={name} />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="description">Описание коллекции</Label>
			<Textarea id="description" placeholder="Описание" bind:value={description} />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="image">Обложка коллекции</Label>
			<UploadCollectionImage id="image" bind:value={imageUrl} />
		</div>

		<div class="flex flex-row items-center gap-2">
			<Checkbox id="private" aria-labelledby="private-label" bind:checked={isPrivate} />

			<Label id="private-label" for="private" class="text-sm font-medium leading-none">
				Сделать коллекцию приватной
			</Label>
		</div>
	</form>
</div>

<Dialog.Footer class="flex flex-row items-center gap-3 max-sm:flex-col">
	{#if type === 'edit'}
		<DeleteButton type="submit" form="collection-form" class="max-sm:w-full" />
	{/if}

	<Button {isLoading} type="submit" form="collection-form" class="!ml-0 max-sm:w-full">
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
