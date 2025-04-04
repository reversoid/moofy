<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import DeleteButton from '$lib/ui/delete-button.svelte';
	import { IconDeviceFloppy, IconPencil } from '@tabler/icons-svelte';
	import Film from './film.svelte';
	import RatingSelect from './rating-select.svelte';
	import SearchFilm from './search-film.svelte';
	import type { FilmDto, ReviewDto, TagDto } from '@repo/api/dtos';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { reviewFormSchema } from './review-form-schema';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Tag } from '$lib/entities/Tag';

	export type ReviewForm = {
		filmId: FilmDto['id'];
		description: string | null;
		score: number | null;
		tags?: number[];
	};

	type ReviewModalProps = {
		existingReview?: ReviewDto;
		tags?: TagDto[];
		onSubmit: (form: ReviewForm) => Promise<void>;
		onSubmitDelete?: (id: ReviewDto['id']) => Promise<void>;
	};

	let { existingReview, onSubmit, onSubmitDelete, tags = $bindable() }: ReviewModalProps = $props();

	let visibleFilm = $state<FilmDto | null>(existingReview?.film ?? null);

	const type = existingReview ? 'edit' : 'create';

	const initialData = {
		filmId: existingReview?.film.id ? String(existingReview?.film.id) : null,
		description: existingReview?.description ?? null,
		score: existingReview?.score ?? null,
		tags: (existingReview?.tags.map((t) => t.id.toString()) ?? []) as string[]
	};

	const form = superForm(defaults(initialData, zod(reviewFormSchema)), {
		SPA: true,
		validators: zod(reviewFormSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				return;
			}

			await onSubmit({
				...form.data,
				tags: form.data.tags?.map(Number),
				description: form.data.description ?? '',
				filmId: Number(form.data.filmId ?? -1)
			});
		}
	});

	const { form: formData, enhance, submitting, errors } = form;

	const isInvalid = $derived(Object.values($errors).filter(Boolean).length > 0);

	let isDeleting = $state(false);

	async function onSubmitDeleteWithLoading(id: ReviewDto['id']) {
		try {
			isDeleting = true;
			await onSubmitDelete?.(id);
		} finally {
			isDeleting = false;
		}
	}

	let tagsIds = $derived(new Set($formData.tags ?? []));

	let selectedTags = $derived(tags?.filter((t) => tagsIds.has(t.id.toString())) ?? []);
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать обзор' : 'Изменить обзор'}</Dialog.Title>
</Dialog.Header>

<form use:enhance id="review-form" class="flex flex-col gap-5 py-4">
	<div class="flex flex-col gap-4">
		{#if type === 'create'}
			<Label for="film">Фильм</Label>
			<SearchFilm bind:filmId={$formData.filmId} bind:film={visibleFilm} />
		{/if}

		{#if visibleFilm}
			<div class="flex flex-col gap-2">
				<p class="text-muted-foreground text-sm">Выбранный фильм</p>

				<Film
					name={visibleFilm.name}
					year={visibleFilm.year}
					posterUrl={visibleFilm.posterPreviewUrl}
				/>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-3">
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
	</div>

	<div class="flex flex-col gap-3">
		<Label for="rating">Оценка</Label>
		<RatingSelect bind:rating={$formData.score} />
	</div>

	{#if tags?.length}
		<div class="mt-2 flex flex-col gap-3">
			<Label>Теги</Label>

			<Select.Root bind:value={$formData.tags} type="multiple">
				<Select.Trigger class="gap-2">
					<div class="flex grow flex-row items-center justify-between gap-2">
						<span>Выберите теги</span>

						<div class="flex flex-row gap-1">
							{#each selectedTags.slice(0, 3) as tag}
								<Tag {tag} ball />
							{/each}
						</div>
					</div>
				</Select.Trigger>

				<Select.Content>
					{#each tags as tag}
						<Select.Item class="flex justify-between" value={String(tag.id)}>
							<span>{tag.name}</span>
							<Tag {tag} ball />
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/if}
</form>

<Dialog.Footer class="flex flex-row gap-3 max-sm:flex-col">
	{#if type === 'edit'}
		<DeleteButton
			isLoading={isDeleting}
			type="button"
			onDelete={() => {
				if (!existingReview) {
					return;
				}

				onSubmitDeleteWithLoading(existingReview.id);
			}}
		/>
	{/if}

	<Button
		disabled={isInvalid}
		isLoading={$submitting}
		class="!ml-0"
		type="submit"
		form="review-form"
	>
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
