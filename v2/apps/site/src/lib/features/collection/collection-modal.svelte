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

	export type CollectionModalProps = {
		type: 'create' | 'edit';
	};

	const { type }: CollectionModalProps = $props();
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать коллекцию' : 'Изменить коллекцию'}</Dialog.Title>
	<Dialog.Description>Коллекции позволяют группировать фильмы</Dialog.Description>
</Dialog.Header>

<div class="mt-2">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col gap-3">
			<Label for="name">Название коллекции</Label>
			<Input id="name" placeholder="Название" />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="description">Описание коллекции</Label>
			<Textarea id="description" placeholder="Описание" />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="image">Обложка коллекции</Label>
			<UploadCollectionImage id="image" />
		</div>

		<div class="flex flex-row items-center gap-2">
			<Checkbox id="private" aria-labelledby="private-label" />

			<Label id="private-label" for="private" class="text-sm font-medium leading-none">
				Сделать коллекцию приватной
			</Label>
		</div>
	</div>
</div>

<Dialog.Footer class="flex flex-row items-center gap-3 max-sm:flex-col">
	{#if type === 'edit'}
		<DeleteButton class="max-sm:w-full" />
	{/if}

	<Button class="!ml-0 max-sm:w-full">
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
