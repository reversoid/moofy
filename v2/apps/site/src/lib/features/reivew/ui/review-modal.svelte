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

	type ReviewForm = {
		film: FilmDto | null;
		description: string | null;
		score: number | null;
	};

	export type CompleteReviewForm = ReviewForm & {
		film: FilmDto;
	};

	type ReviewModalProps = {
		existingReview?: ReviewDto;
		onSubmit: (form: CompleteReviewForm) => Promise<void>;
		onSubmitDelete?: (id: ReviewDto['id']) => Promise<void>;
	};

	const { existingReview, onSubmit, onSubmitDelete }: ReviewModalProps = $props();

	const type = existingReview ? 'edit' : 'create';

	let form = $state<ReviewForm>({
		film: existingReview?.film ?? null,
		description: existingReview?.description ?? null,
		score: existingReview?.score ?? null
	});

	let isSubmitting = $state(false);

	async function onSubmitWithLoading(props: CompleteReviewForm) {
		isSubmitting = true;
		await onSubmit(props);
		isSubmitting = false;
	}

	let isDeleting = $state(false);

	async function onSubmitDeleteWithLoading(id: ReviewDto['id']) {
		isDeleting = true;
		console.log('start');

		await onSubmitDelete?.(id);
		console.log('end');

		isDeleting = false;
	}
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать обзор' : 'Изменить обзор'}</Dialog.Title>
</Dialog.Header>

<form
	id="review-form"
	class="flex flex-col gap-5 py-4"
	onsubmit={() => {
		if (!form.film) {
			return;
		}

		onSubmitWithLoading({ film: form.film, description: form.description, score: form.score });
	}}
>
	<div class="flex flex-col gap-4">
		{#if type === 'create'}
			<Label for="film">Фильм</Label>
			<SearchFilm bind:film={form.film} />
		{/if}

		{#if form.film}
			<div class="flex flex-col gap-2">
				<p class="text-muted-foreground text-sm">Выбранный фильм</p>

				<Film name={form.film.name} year={form.film.year} posterUrl={form.film.posterUrl} />
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-3">
		<Label for="description">Описание</Label>
		<Textarea bind:value={form.description} id="description" placeholder="Описание..." />
	</div>

	<div class="flex flex-col gap-3">
		<Label for="rating">Оценка</Label>
		<RatingSelect bind:rating={form.score} />
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
		<DeleteButton
			isLoading={true}
			type="button"
			onDelete={() => {
				if (!existingReview) {
					return;
				}

				onSubmitDeleteWithLoading(existingReview.id);
			}}
		/>
	{/if}

	<Button isLoading={isSubmitting} class="!ml-0" type="submit" form="review-form">
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
