<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Some collection title</Card.Title>
		<Card.Description>Some collection description</Card.Description>
	</Card.Header>

	<Card.Content>
		<div>
			<img
				class="aspect-[4/3] w-full rounded-md object-cover"
				src="https://picsum.photos/300/300"
				alt="Collection"
			/>
		</div>
	</Card.Content>
</Card.Root>
