<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
	import { colorHash } from '$lib/utils/color-hash';

	interface Props {
		id: number;
		name: string;
		description: string | null;
		imageUrl: string | null;
	}

	const { id, name, description, imageUrl }: Props = $props();
</script>

<Link href="/collections/{id}" class="block h-full">
	<Card.Root class="flex h-full flex-col justify-between">
		<Card.Header>
			<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
				{name}
			</Card.Title>
			<Card.Description class="line-clamp-2">
				{description?.trim() || 'Описание отсутствует'}
			</Card.Description>
		</Card.Header>

		<Card.Content class="max-md:!pt-0">
			{#if imageUrl}
				<img class="aspect-[4/3] w-full rounded-md object-cover" src={imageUrl} alt="Collection" />
			{:else}
				<div
					class="aspect-[4/3] w-full rounded-md"
					style="background-color: {colorHash.hex(String(id))}"
				></div>
			{/if}
		</Card.Content>
	</Card.Root>
</Link>
