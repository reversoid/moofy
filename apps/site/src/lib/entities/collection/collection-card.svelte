<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
	import { colorHash } from '$lib/utils/color-hash';
	import type { CollectionDto } from '@repo/api/dtos';
	import PrivateTooltip from './private-tooltip.svelte';
	import Image from '$lib/ui/image.svelte';

	interface Props {
		collection: CollectionDto;
	}

	const { collection }: Props = $props();
</script>

<Link href="/collections/{collection.id}" class="block h-full">
	<Card.Root class="flex h-full flex-col justify-between">
		<Card.Header>
			<div class="flex items-center justify-between gap-2">
				<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
					{collection.name}
				</Card.Title>

				{#if !collection.isPublic}
					<PrivateTooltip />
				{/if}
			</div>
			<Card.Description class="line-clamp-1">
				{collection.description?.trim() || 'Описание отсутствует'}
			</Card.Description>
		</Card.Header>

		<Card.Content class="max-md:!pt-0">
			{#if collection.imageUrl}
				<Image
					class="aspect-[4/3] w-full rounded-md object-cover"
					src={collection.imageUrl}
					alt="Collection"
				/>
			{:else}
				<div
					class="aspect-[4/3] w-full rounded-md"
					style="background-color: {colorHash.hex(String(collection.id))}"
				></div>
			{/if}
		</Card.Content>
	</Card.Root>
</Link>
