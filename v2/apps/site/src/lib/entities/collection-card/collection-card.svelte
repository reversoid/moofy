<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root>
	<Card.Header class="max-sm:p-4">
		<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
			Some collection title
		</Card.Title>
		<Card.Description>Some collection description</Card.Description>
	</Card.Header>

	<Card.Content class="max-sm:p-4 max-sm:pt-0">
		<img
			class="aspect-[4/3] w-full rounded-md object-cover"
			src="https://picsum.photos/300/300"
			alt="Collection"
		/>
	</Card.Content>
</Card.Root>
