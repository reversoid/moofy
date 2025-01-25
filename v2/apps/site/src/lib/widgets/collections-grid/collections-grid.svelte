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

<div class="flex flex-col gap-4">
	<Input placeholder="Поиск">
		{#snippet inputPrefix()}
			<IconSearch size={20} />
		{/snippet}
	</Input>

	<div class="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:gap-2">
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
