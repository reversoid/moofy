<script>
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
	import { Badge } from '$lib/components/ui/badge';
</script>

<Card.Root class="flex flex-row max-sm:flex-col">
	<Card.Content class="!pr-0">
		<img
			src="https://picsum.photos/300/300"
			alt="Interstellar"
			class="aspect-[2/3] h-40 rounded-sm object-cover max-sm:mx-auto max-sm:h-44"
		/>
	</Card.Content>

	<Card.Header class="flex flex-col max-sm:!pb-4 max-sm:pt-0">
		<div class="flex flex-row flex-wrap gap-2">
			<Card.Title class="text-lg">
				<Link isExternal target="_blank" href="https://google.com">Видоизмененный углерод</Link>
			</Card.Title>
			<Badge class="w-fit text-sm" variant="secondary">2024</Badge>
		</div>

		<p>Супер фильм!!!!</p>
	</Card.Header>
</Card.Root>
