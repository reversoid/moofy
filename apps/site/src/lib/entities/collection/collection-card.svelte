<script lang="ts">
	import Link from '$lib/shared/ui/link.svelte';
	import CollectionName from '$lib/shared/utils/collection-name.svelte';
	import { colorHash } from '$lib/shared/utils/color-hash';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconDeviceTv, IconUser } from '@tabler/icons-svelte';
	import IconContainer from './icon-container.svelte';
	import PrivateTooltip from './private-tooltip.svelte';

	interface Props {
		collection: CollectionDto;
	}

	const { collection }: Props = $props();

	const href = $derived(`/collections/${collection.id}`);
</script>

<Link {href} class="block h-full">
	<div class="flex gap-4 rounded-lg border p-3">
		<div class="relative flex shrink-0 items-center justify-center">
			{#if collection.imageUrl}
				<img
					class="aspect-[4/3] h-24 rounded-md object-cover"
					src={collection.imageUrl}
					alt="collection"
				/>
			{:else}
				<div
					class="aspect-[4/3] h-24 rounded-md"
					style="background-color: {colorHash.hex(String(collection.id))}"
				></div>
			{/if}

			{#if collection.type === 'personal'}
				<IconContainer>
					<IconUser class="w-full" size="100%" />
				</IconContainer>
			{:else if collection.type === 'watch'}
				<IconContainer>
					<IconDeviceTv class="w-full" size="100%" />
				</IconContainer>
			{/if}
		</div>

		<div class="flex grow flex-col gap-1 overflow-hidden">
			<div class="flex items-center justify-between gap-1">
				<h6 class="text-primary overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
					<CollectionName {collection} />
				</h6>

				{#if !collection.isPublic}
					<PrivateTooltip />
				{/if}
			</div>

			<p class="text-muted-foreground line-clamp-3 text-sm">
				{collection.description ?? 'Описание отсутствует'}
			</p>
		</div>
	</div>
</Link>
