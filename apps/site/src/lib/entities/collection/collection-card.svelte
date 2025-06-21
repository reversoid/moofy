<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Image from '$lib/shared/ui/image.svelte';
	import Link from '$lib/shared/ui/link.svelte';
	import CollectionName from '$lib/shared/utils/collection-name.svelte';
	import { colorHash } from '$lib/shared/utils/color-hash';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconDeviceTv, IconUser } from '@tabler/icons-svelte';
	import PrivateTooltip from './private-tooltip.svelte';

	interface Props {
		collection: CollectionDto;
	}

	const { collection }: Props = $props();

	const href = $derived(`/collections/${collection.id}`);
</script>

<Link {href} class="block h-full">
	<Card.Root class="flex h-full flex-col justify-between">
		<Card.Header>
			<div class="flex items-center justify-between gap-2">
				<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
					<div class="flex w-full items-center gap-2">
						<!-- {#if collection.type === 'personal'}
							<IconMushroom class="flex-shrink-0" size={20} />
						{/if}

						{#if collection.type === 'watch'}
							<IconCircleCheck class="flex-shrink-0" size={20} />
						{/if} -->

						<CollectionName {collection} />
					</div>
				</Card.Title>

				{#if !collection.isPublic}
					<PrivateTooltip />
				{/if}
			</div>
			<Card.Description class="line-clamp-1">
				{#if collection.description}
					<p>{collection.description.trim()}</p>
				{:else}
					<p class="text-muted-foreground">Описание отсутствует</p>
				{/if}
			</Card.Description>
		</Card.Header>

		<Card.Content class="relative">
			{#if collection.type === 'watch'}
				<IconDeviceTv
					class="absolute left-[50%] top-[50%] w-[30%] flex-shrink-0 translate-x-[-50%] translate-y-[-50%] opacity-90"
					size={'100%'}
				/>
			{/if}

			{#if collection.type === 'personal'}
				<IconUser
					class="absolute left-[50%] top-[50%] w-[30%] flex-shrink-0 translate-x-[-50%] translate-y-[-50%] opacity-90"
					size={'100%'}
				/>
			{/if}
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
