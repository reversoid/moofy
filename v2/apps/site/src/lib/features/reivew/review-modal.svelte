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

	const { type }: ReviewModalProps = $props();
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Создать обзор' : 'Изменить обзор'}</Dialog.Title>
</Dialog.Header>

<div class="flex flex-col gap-5 py-4">
	<div class="flex flex-col gap-4">
		{#if type === 'create'}
			<Label for="film">Фильм</Label>
			<Combobox id="film" />
		{/if}

		<div class="flex flex-col gap-2">
			<p class="text-muted-foreground text-sm">Выбранный фильм</p>

			<!-- TODO make film component -->
			<div class="bg-secondary flex flex-row gap-4 rounded-lg p-4">
				<img
					src="https://picsum.photos/200/300"
					class="aspect-[2/3] h-20 rounded-lg object-cover"
					alt="s"
				/>

				<div class="flex flex-col gap-1">
					<b>Интерстеллар</b>
					<p class="text-muted-foreground text-sm">2024</p>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<Label for="description">Описание</Label>
		<Textarea id="description" placeholder="Описание..." />
	</div>

	<div class="flex flex-col gap-3">
		<Label for="rating">Оценка</Label>
		<div id="rating" class="flex items-center justify-between gap-4 max-sm:gap-2">
			<Badge variant="secondary" class="flex-1 justify-center">
				<IconStar class="mr-1" size="16" />
				<span>1</span>
			</Badge>
			<Badge variant="secondary" class="flex-1 justify-center">
				<IconStar class="mr-1" size="16" />
				<span>2</span>
			</Badge><Badge class="flex-1 justify-center">
				<IconStar class="mr-1" size="16" />
				<span>3</span>
			</Badge><Badge variant="secondary" class="flex-1 justify-center">
				<IconStar class="mr-1" size="16" />
				<span>4</span>
			</Badge><Badge variant="secondary" class="flex-1 justify-center">
				<IconStar class="mr-1" size="16" />
				<span>5</span>
			</Badge>
		</div>
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
