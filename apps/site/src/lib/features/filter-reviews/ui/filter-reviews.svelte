<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { IconFilter, IconFilterFilled, IconSearch } from '@tabler/icons-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { parseDateField, parseNumericField } from '../utils/parseFieldValues';
	import type { ReviewFilters } from '../utils/types';
	import type { CollectionDto, FilmTypeDto, TagDto } from '@repo/api/dtos';
	import TagsSelect from '$lib/features/tags/ui/tags-select.svelte';
	import { onMount } from 'svelte';
	import { makeClient } from '$lib/shared/utils';

	type Props = {
		onFiltersApplied: (filters: ReviewFilters | null) => Promise<void>;
		areFiltersApplied?: boolean;
		tags: TagDto[];
		collection: CollectionDto;
	};

	const { onFiltersApplied, areFiltersApplied, tags, collection }: Props = $props();

	const schema = z.object({
		// comparable fields
		year: z.string().optional(),
		duration: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		score: z.string().optional(),

		// other fields
		type: z.array(z.string()).optional().default([]),
		genres: z.array(z.string()).optional().default([]),
		tags: z.array(z.number()).optional().default([])
	});

	type FieldNames = keyof z.infer<typeof schema>;

	type FieldNamesWithError = Extract<
		FieldNames,
		'year' | 'duration' | 'createdAt' | 'updatedAt' | 'score'
	>;

	class TrackFieldError extends Error {
		fieldName: FieldNamesWithError;

		constructor(fieldName: FieldNamesWithError) {
			super();
			this.fieldName = fieldName;
		}
	}

	const trackErrorField = <O,>(fn: () => O, fieldName: FieldNamesWithError): O => {
		try {
			const result = fn();
			return result;
		} catch (error) {
			throw new TrackFieldError(fieldName);
		}
	};

	const form = superForm(defaults({}, zod(schema)), {
		SPA: true,
		validators: zod(schema),
		async onUpdate(event) {
			const data = event.form.data;

			try {
				await onFiltersApplied({
					createdAt: trackErrorField(
						() => (data.createdAt ? parseDateField(data.createdAt) : undefined),
						'createdAt'
					),
					updatedAt: trackErrorField(
						() => (data.updatedAt ? parseDateField(data.updatedAt) : undefined),
						'updatedAt'
					),
					genres: data.genres?.length ? data.genres : undefined,

					lengths: trackErrorField(
						() => (data.duration ? parseNumericField(data.duration) : undefined),
						'duration'
					),

					tagIds: data.tags?.length ? data.tags : undefined,
					types: data.type?.length ? data.type : undefined,

					years: trackErrorField(
						() => (data.year ? parseNumericField(data.year) : undefined),
						'year'
					),

					score: trackErrorField(
						() => (data.score ? parseNumericField(data.score) : undefined),
						'score'
					)
				});

				isOpen = false;
			} catch (e) {
				if (e instanceof TrackFieldError) {
					event.form.errors[e.fieldName] = ['Неправильный формат'];

					return;
				}

				console.error('error', e);
			}
		},
		resetForm: false
	});

	const { enhance, form: formData, formId, submitting } = form;

	let isOpen = $state(false);

	let genres = $state<string[]>();
	let filmTypes = $state<FilmTypeDto[]>();

	onMount(async () => {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId']['filter-details'].$get({
			param: { collectionId: collection.id.toString() }
		});

		if (!response.ok) {
			console.error('Could not load filter params');
			return;
		}

		const filterDetails = await response.json();

		genres = filterDetails.genres;
		filmTypes = filterDetails.types;
	});

	const filmTypeTranslation: Record<FilmTypeDto, string> = {
		FILM: 'Фильм',
		MINI_SERIES: 'Мини-сериал',
		TV_SERIES: 'Сериал',
		TV_SHOW: 'ТВ-шоу',
		VIDEO: 'Видео'
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<Button tag="div" size="icon" variant="outline">
			{#if areFiltersApplied}
				<IconFilterFilled />
			{:else}
				<IconFilter />
			{/if}
		</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Фильтр обзоров</Dialog.Title>
			<Dialog.Description class="mt-4">
				Для текстовых полей вы можете использовать следующие форматы:
				<br /> <b>A</b> для указания точного значения
				<br /> <b>A-B</b> для указания диапазона
				<br /> <b>A-B, C, D</b> для указания перечисления
			</Dialog.Description>
		</Dialog.Header>

		<form id={$formId} use:enhance class="mt-2 flex flex-col gap-2">
			<Form.Field {form} name="year">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Год</Form.Label>
						<Input bind:value={$formData.year} placeholder="2024" {...attrs} />
					{/snippet}
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="duration">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Длительность, мин.</Form.Label>
						<Input bind:value={$formData.duration} placeholder="90" {...attrs} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="score">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Оценка</Form.Label>
						<Input bind:value={$formData.score} placeholder="5" {...attrs} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Тип</Form.Label>
						<Select.Root
							disabled={!Boolean(filmTypes?.length)}
							type="multiple"
							bind:value={$formData.type}
						>
							<Select.Trigger>
								<span>
									{$formData.type?.length ? `Выбрано: ${$formData.type?.length}` : 'Тип'}
								</span>
							</Select.Trigger>
							<Select.Content>
								{#each filmTypes ?? [] as type}
									<Select.Item value={type}>{filmTypeTranslation[type]}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="genres">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Жанры</Form.Label>
						<Select.Root
							disabled={!Boolean(genres?.length)}
							type="multiple"
							bind:value={$formData.genres}
						>
							<Select.Trigger>
								<span>
									{$formData.genres?.length ? `Выбрано: ${$formData.genres?.length}` : 'Жанры'}
								</span>
							</Select.Trigger>
							<Select.Content>
								{#each genres ?? [] as genre}
									<Select.Item class="capitalize" value={genre}>{genre}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if tags.length}
				<Form.Field {form} name="tags">
					<Form.Control>
						{#snippet children({ attrs }: { attrs: any })}
							<Form.Label>Теги</Form.Label>

							<TagsSelect
								{tags}
								bind:selectedTagsIds={
									() => ($formData.tags ?? [])?.map(String),
									(v) => {
										$formData.tags = v.map(Number);
									}
								}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}

			<Form.Field {form} name="createdAt">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Дата создания</Form.Label>
						<Input bind:value={$formData.createdAt} placeholder="01.02.2023" {...attrs} />
					{/snippet}
				</Form.Control>

				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="updatedAt">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Дата обновления</Form.Label>
						<Input bind:value={$formData.updatedAt} placeholder="01.02.2023" {...attrs} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>

		<Dialog.Footer class="mt-4 flex-col gap-3 sm:flex">
			<Button
				disabled={$submitting}
				onclick={async () => {
					await onFiltersApplied(null);
					$formData = { genres: [], tags: [], type: [] };
					isOpen = false;
				}}
				variant="outline">Сбросить</Button
			>

			<Button isLoading={$submitting} class="!ml-0" type="submit" form={$formId}
				><IconSearch /> Поиск</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
