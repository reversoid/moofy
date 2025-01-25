<script lang="ts" module>
	export type ReviewModalProps = {
		type: 'create' | 'edit';
	};
</script>

<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { IconDeviceFloppy, IconPencil, IconStar } from '@tabler/icons-svelte';
	import DeleteButton from '$lib/ui/delete-button.svelte';
	import { Label } from '$lib/components/ui/label';
	import SearchFilm from './search-film.svelte';
	import RatingSelect from './rating-select.svelte';
	import Film from './film.svelte';

	const { type }: ReviewModalProps = $props();
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать обзор' : 'Изменить обзор'}</Dialog.Title>
</Dialog.Header>

<div class="flex flex-col gap-5 py-4">
	<div class="flex flex-col gap-4">
		{#if type === 'create'}
			<Label for="film">Фильм</Label>
			<SearchFilm />
		{/if}

		<div class="flex flex-col gap-2">
			<p class="text-muted-foreground text-sm">Выбранный фильм</p>

			<Film name="Интерстеллар" year="2024" posterUrl="https://picsum.photos/200/300" />
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<Label for="description">Описание</Label>
		<Textarea id="description" placeholder="Описание..." />
	</div>

	<div class="flex flex-col gap-3">
		<Label for="rating">Оценка</Label>
		<RatingSelect />
	</div>
</div>

<Dialog.Footer class="flex flex-row gap-3 max-sm:flex-col">
	{#if type === 'edit'}
		<DeleteButton />
	{/if}

	<Button class="!ml-0" type="submit">
		{#if type === 'create'}
			<IconPencil />
		{:else}
			<IconDeviceFloppy />
		{/if}

		{type === 'create' ? 'Создать' : 'Сохранить'}
	</Button>
</Dialog.Footer>
