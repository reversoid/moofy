<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import DeleteButton from '$lib/ui/delete-button.svelte';
	import {
		IconDeviceFloppy,
		IconPencil,
		IconPhoto,
		IconPlus,
		IconTrash,
		IconUpload
	} from '@tabler/icons-svelte';
	import type { CollectionDto, TagDto } from '@repo/api/dtos';
	import Image from '$lib/ui/image.svelte';
	import UploadImage from '$lib/ui/upload-image.svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { collectionSchema } from './collection-schema';
	import { Tag } from '$lib/entities/Tag';
	import EditTags from './edit-tags.svelte';

	export type CollectionForm = {
		name: string;
		description: string | null;
		isPublic: boolean;
		imageUrl: string | null;
	};

	type CollectionModalProps = {
		collection?: CollectionDto;
		tags?: TagDto[];
		onSubmit: (props: CollectionForm) => Promise<void>;
		onDelete?: () => Promise<void>;
	};

	const { collection, tags, onSubmit, onDelete }: CollectionModalProps = $props();

	const type = $derived(collection ? 'edit' : 'create');

	const initialData = {
		name: collection?.name ?? '',
		description: collection?.description ?? null,
		isPrivate: collection?.isPublic === false,
		imageUrl: collection?.imageUrl ?? null
	};

	const form = superForm(defaults(initialData, zod(collectionSchema)), {
		SPA: true,
		validators: zod(collectionSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				return;
			}

			isLoading = true;
			await onSubmit({ ...form.data, isPublic: !form.data.isPrivate });
			isLoading = false;
		}
	});

	const { form: formData, enhance } = form;

	let isLoading = $state(false);
	let isDeleting = $state(false);

	async function onDeleteWithLoading() {
		isDeleting = true;
		await onDelete?.();
		isDeleting = false;
	}
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать коллекцию' : 'Изменить коллекцию'}</Dialog.Title>
	<Dialog.Description>Коллекции позволяют группировать фильмы</Dialog.Description>
</Dialog.Header>

<div class="mt-2">
	<form id="collection-form" class="flex flex-col gap-2 pb-4" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ attrs }: { attrs: any })}
					<Form.Label>Название</Form.Label>
					<Input {...attrs} bind:value={$formData.name} placeholder="Название..." />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ attrs }: { attrs: any })}
					<Form.Label>Описание</Form.Label>
					<Textarea {...attrs} bind:value={$formData.description} placeholder="Описание..." />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<div class="mt-2 flex flex-col gap-3.5">
			<Label>Обложка коллекции</Label>
			<div class="flex gap-4 max-sm:flex-col">
				<div class="shrink-0 max-sm:mx-auto">
					{#if $formData.imageUrl}
						<Image
							class="aspect-[4/3] h-32 rounded object-cover"
							src={$formData.imageUrl}
							alt="Обложка коллекции"
						/>
					{:else}
						<div class="bg-muted flex aspect-[4/3] h-32 items-center justify-center rounded">
							<IconPhoto />
						</div>
					{/if}
				</div>

				<div class="flex flex-grow flex-col justify-start gap-4">
					<div class="flex items-start gap-2">
						<UploadImage class="flex-grow" resource="collection" bind:imageUrl={$formData.imageUrl}>
							{#snippet children({ isLoading })}
								<Button class="w-full" {isLoading} variant="outline" type="button">
									<IconUpload />
									<span>Загрузить</span>
								</Button>
							{/snippet}
						</UploadImage>

						<Button
							class="flex-grow"
							onclick={() => ($formData.imageUrl = null)}
							variant="outline"
							type="button"
						>
							<IconTrash />
							<span>Удалить</span>
						</Button>
					</div>

					<div class="flex flex-col">
						<p class="text-muted-foreground text-sm">
							Изображение будет преобразовано с соотношением сторон 4:3
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if tags}
			<div class="mt-2 flex flex-col gap-2.5">
				<Label>Тэги</Label>
				<EditTags {tags} />
			</div>
		{/if}

		<div class="mt-2 flex flex-row items-center gap-2">
			<Checkbox id="private" aria-labelledby="private-label" bind:checked={$formData.isPrivate} />

			<Label id="private-label" for="private" class="text-sm font-medium leading-none">
				Сделать коллекцию приватной
			</Label>
		</div>
	</form>
</div>

<Dialog.Footer class="flex flex-row items-center gap-3 max-sm:flex-col">
	{#if type === 'edit'}
		<DeleteButton
			onDelete={onDeleteWithLoading}
			isLoading={isDeleting}
			type="button"
			form="collection-form"
			class="max-sm:w-full"
		/>
	{/if}

	<Button
		disabled={!$formData.name}
		{isLoading}
		type="submit"
		form="collection-form"
		class="!ml-0 max-sm:w-full"
	>
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
