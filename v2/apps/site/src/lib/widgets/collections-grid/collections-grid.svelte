<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { CollectionCard } from '$lib/entities/collection-card';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import { IconChevronDown, IconSearch } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	const { firstCard }: { firstCard?: Snippet } = $props();
</script>

<div class="@container flex flex-col gap-4">
	<Input placeholder="Поиск">
		{#snippet inputPrefix()}
			<IconSearch size={20} />
		{/snippet}
	</Input>

	<!-- TODO make responsive by min width, not max-width 
	 -->
	<div class="@5xl:grid-cols-4 @xl:grid-cols-3 @xl:gap-4 @sm:grid-cols-2 grid grid-cols-1 gap-2">
		{@render firstCard?.()}

		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
	</div>

	<LoadMoreButton />
</div>
