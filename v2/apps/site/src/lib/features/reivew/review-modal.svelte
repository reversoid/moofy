<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { IconStar } from '@tabler/icons-svelte';

	export let type: 'create' | 'edit' = 'create';
</script>

<Dialog.Header>
	<Dialog.Title>{type === 'create' ? 'Добавить обзор' : 'Изменить обзор'}</Dialog.Title>
</Dialog.Header>

<div class="flex flex-col gap-5 py-4">
	<div class="flex flex-col gap-4">
		{#if type === 'create'}
			<b>Фильм</b>
			<Combobox />
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

	<div class="flex flex-col gap-4">
		<b>Описание</b>
		<Textarea placeholder="Описание..." />
	</div>

	<div class="flex flex-col gap-4">
		<b>Оценка</b>
		<div class="flex items-center justify-between gap-6 max-sm:gap-2">
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

<Dialog.Footer>
	<Button type="submit">Сохранить</Button>
</Dialog.Footer>
