<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import CreateCollection from './create-collection.svelte';
</script>

<Card.Root class="flex flex-col items-center justify-center">
	<Card.Header>
		<Card.Title class="text-center">Новая коллекция</Card.Title>
	</Card.Header>

	<Card.Content>
		<CreateCollection />
	</Card.Content>
</Card.Root>
