<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { CollectionCard } from '$lib/entities/collection-card';
	import CreateCollectionCard from '$lib/features/collection/create-collection-card.svelte';
	import { IconSearch } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Поиск">
		<IconSearch size={20} slot="prefix" />
	</Input>

	<div class="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:gap-2">
		<CreateCollectionCard />

		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
		<CollectionCard />
	</div>
</div>
