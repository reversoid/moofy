<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
</script>

<!-- TOOD some fetch logic -->

<Wrapper>
	<Heading type="h2">Мои коллекции</Heading>
	<Heading type="h2">Избранное</Heading>

	<CollectionsGrid />
</Wrapper>
