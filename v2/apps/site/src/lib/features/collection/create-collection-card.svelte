<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { CollectionDto } from '@repo/api/dtos';
	import CreateCollection from './create-collection.svelte';

	interface Props {
		onCollectionCreated: (collection: CollectionDto) => void;
	}

	const { onCollectionCreated }: Props = $props();
</script>

<Card.Root class="flex flex-col items-center justify-center">
	<Card.Header>
		<Card.Title class="text-center">Новая коллекция</Card.Title>
	</Card.Header>

	<Card.Content class="max-md:!pt-0">
		<CreateCollection {onCollectionCreated} />
	</Card.Content>
</Card.Root>
