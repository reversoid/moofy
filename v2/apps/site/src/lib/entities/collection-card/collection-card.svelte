<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
</script>

<Link href="/collections/1">
	<Card.Root>
		<Card.Header>
			<Card.Title class="overflow-hidden text-ellipsis whitespace-nowrap">
				Some collection title
			</Card.Title>
			<Card.Description>Some collection description</Card.Description>
		</Card.Header>

		<Card.Content>
			<img
				class="aspect-[4/3] w-full rounded-md object-cover"
				src="https://picsum.photos/300/300"
				alt="Collection"
			/>
		</Card.Content>
	</Card.Root>
</Link>
