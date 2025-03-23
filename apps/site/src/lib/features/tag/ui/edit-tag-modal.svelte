<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Tag } from '$lib/entities/Tag';
	import type { TagDto } from '@repo/api/dtos';
	import { IconRefresh } from '@tabler/icons-svelte';
	import ColorHash from 'color-hash';
	import { maska } from 'maska/svelte';
	import { Mask } from 'maska';

	const mask = new Mask({ tokens: { F: { pattern: /[0-9A-Fa-f]/ } }, mask: '!#FFFFFF' });

	const tagColorHash = new ColorHash({ lightness: [0.7], saturation: [0.95] });

	function generateRandomColor() {
		const uuid = window.crypto.randomUUID();
		return tagColorHash.hex(uuid).toUpperCase();
	}

	function isCorrectHexColor(hexColorString: string) {
		return /^#[A-Fa-f0-9]{6}$/.test(hexColorString);
	}

	type Props = {
		isOpen: boolean;
		tag?: TagDto;
		onSave: (options: Pick<TagDto, 'name' | 'hexColor' | 'description'>) => Promise<unknown>;
	};

	let { isOpen = $bindable(), tag, onSave }: Props = $props();

	let name = $state(tag?.name ?? 'New Tag');
	let hexColor = $state(tag?.hexColor ?? generateRandomColor());
	let description = $state(tag?.description ?? null);

	let isLoading = $state(false);

	let visibleTag = $derived<TagDto>({
		id: tag?.id ?? 1,
		createdAt: new Date().toISOString(),
		hexColor: hexColor,
		name: name,
		description: null
	});

	const badTag: TagDto = {
		createdAt: new Date().toISOString(),
		hexColor: '#FFFFFF',
		id: 1,
		name: 'Bad Tag',
		description: null
	};

	let tagIsCorrect = $derived(Boolean(visibleTag.name) && isCorrectHexColor(visibleTag.hexColor));

	async function onSaveWithLoading(options: Parameters<typeof onSave>[0]) {
		try {
			isLoading = true;
			await onSave(options);
			isOpen = false;
		} finally {
			isLoading = false;
		}
	}

	const handleColorRefresh = () => {
		hexColor = generateRandomColor();
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Тэг</Dialog.Title>
			<!-- <Dialog.Description>Здесь Вы можете настроить тэги для коллекции</Dialog.Description> -->
		</Dialog.Header>

		<div class="flex flex-col gap-2 py-2">
			<Input bind:value={name} placeholder="Название" />
			<div class="flex flex-row gap-2">
				<Input
					use={(node) => maska(node, mask.opts)}
					bind:value={
						() => hexColor,
						(v) => {
							hexColor = v.toUpperCase();
						}
					}
					placeholder="Цвет"
				/>

				<Button onclick={handleColorRefresh} size="icon" variant="outline">
					<IconRefresh />
				</Button>
			</div>

			<div class="mt-2">
				{#if tagIsCorrect}
					<Tag tag={visibleTag} />
				{:else}
					<Tag tag={badTag} />
				{/if}
			</div>
		</div>

		<Dialog.Footer>
			<Button onclick={() => (isOpen = false)} variant="outline">Отменить</Button>
			<Button
				{isLoading}
				onclick={() => onSaveWithLoading({ hexColor, name, description })}
				disabled={!tagIsCorrect}>Сохранить</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
