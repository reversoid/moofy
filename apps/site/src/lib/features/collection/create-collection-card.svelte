<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { CollectionDto } from '@repo/api/dtos';
	import CreateCollection from './create-collection.svelte';

	interface Props {
		onCollectionCreated: (collection: CollectionDto) => void;
	}

	const { onCollectionCreated }: Props = $props();
</script>

<Card.Root class="flex h-full w-full flex-col items-center justify-center gap-1">
	<Card.Content class="min-md:!pt-0 w-full">
		<CreateCollection {onCollectionCreated} />
	</Card.Content>
</Card.Root>
