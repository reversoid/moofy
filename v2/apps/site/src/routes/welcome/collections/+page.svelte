<script lang="ts">
	import { CreateCollectionCard } from '$lib/features/collection';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
</script>

<CollectionsGrid>
	{#snippet firstCard()}
		<CreateCollectionCard />
	{/snippet}
</CollectionsGrid>
