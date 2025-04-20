<script lang="ts">
	import { makeClient } from '$lib/shared/utils';
	import type { CollectionDto, TagDto } from '@repo/api/dtos';
	import { toast } from 'svelte-sonner';
	import * as Select from '$lib/components/ui/select';
	import { colorHash } from '$lib/shared/utils/color-hash';
	import { TagsSelect } from '$lib/features/tags';
	import * as Alert from '$lib/components/ui/alert';
	import { IconPercentage0 } from '@tabler/icons-svelte';

	type Props = {
		selectedCollectionId: string | undefined;
		selectedTagsIds: string[];
		tags: TagDto[];
	};

	let { selectedCollectionId = $bindable(), selectedTagsIds = $bindable(), tags }: Props = $props();

	let allCollections = $state<CollectionDto[]>([]);
	let selectedCollection = $derived(
		allCollections.find((c) => c.id === Number(selectedCollectionId))
	);

	async function getAllCollections() {
		const api = makeClient(fetch);

		let cursor: string | null = null;
		const collections: CollectionDto[] = [];

		do {
			const result = await api.profile.collections.$get({
				query: { limit: '50', cursor: cursor ?? undefined }
			});
			if (!result.ok) {
				toast.error('Не удалось загрузить список коллекций');
				return [];
			}

			const { collections: newCollections } = await result.json();

			cursor = newCollections.cursor;
			collections.push(...newCollections.items);
		} while (cursor !== null);

		return collections;
	}

	$effect(() => {
		getAllCollections().then((v) => (allCollections = v));
	});
</script>

<p class="text-muted-foreground text-sm">
	Будут импортированы только видимые обзоры с оценкой описанием
</p>

<div class="mt-3 flex flex-col gap-4">
	<Select.Root bind:value={selectedCollectionId} type="single">
		<Select.Trigger class="gap-2">
			{#if selectedCollection}
				{selectedCollection.name}
			{:else}
				<span>Выберите коллекцию</span>
			{/if}
		</Select.Trigger>

		<Select.Content>
			{#each allCollections as c}
				<Select.Item class="flex justify-between" value={String(c.id)}>
					<div class="flex items-center gap-4 overflow-hidden">
						<div class="w-16 shrink-0">
							{#if c.imageUrl}
								<img src={c.imageUrl} class="aspect-[4/3] w-full" alt="Collection" />
							{:else}
								<div
									class="aspect-[4/3] w-full rounded-md"
									style="background-color: {colorHash.hex(String(c.id))}"
								></div>
							{/if}
						</div>

						<div class="flex flex-col overflow-hidden">
							<span class="font-bold">{c.name}</span>
							<p class="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
								{c.description ?? 'Описание отсутствует'}
							</p>
						</div>
					</div>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<TagsSelect {tags} bind:selectedTagsIds />
</div>
