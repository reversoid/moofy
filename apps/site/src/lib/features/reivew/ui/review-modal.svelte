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
	import type { FilmDto, ReviewDto } from '@repo/api/dtos';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { reviewFormSchema } from './review-form-schema';
	import * as Form from '$lib/components/ui/form';

	export type ReviewForm = {
		filmId: FilmDto['id'];
		description: string | null;
		score: number | null;
	};

	type ReviewModalProps = {
		existingReview?: ReviewDto;
		onSubmit: (form: ReviewForm) => Promise<void>;
		onSubmitDelete?: (id: ReviewDto['id']) => Promise<void>;
	};

	const { existingReview, onSubmit, onSubmitDelete }: ReviewModalProps = $props();

	let visibleFilm = $state<FilmDto | null>(existingReview?.film ?? null);

	const type = existingReview ? 'edit' : 'create';

	const initialData = {
		filmId: existingReview?.film.id ?? null,
		description: existingReview?.description ?? null,
		score: existingReview?.score ?? null
	};

	const form = superForm(defaults(initialData, zod(reviewFormSchema)), {
		SPA: true,
		validators: zod(reviewFormSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				return;
			}

			await onSubmit(form.data as ReviewForm);
		}
	});

	const { form: formData, enhance, submitting, errors, isTainted } = form;

	const isInvalid = $derived(Object.values($errors).filter(Boolean).length > 0);

	let isDeleting = $state(false);

	async function onSubmitDeleteWithLoading(id: ReviewDto['id']) {
		isDeleting = true;

		await onSubmitDelete?.(id);

		isDeleting = false;
	}
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

				<Film name={visibleFilm.name} year={visibleFilm.year} posterUrl={visibleFilm.posterUrl} />
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
