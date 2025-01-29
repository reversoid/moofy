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

<Link href="/collections/{id}">
	<Card.Root>
		<Card.Header>
			<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
				{name}
			</Card.Title>
			<Card.Description>
				{description ?? 'Описание отсутствует'}
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
