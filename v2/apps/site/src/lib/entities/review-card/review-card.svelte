<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import type { ReviewDto } from '@repo/api/dtos';
	import type { Snippet } from 'svelte';

	interface Props {
		review: ReviewDto;
		actions?: Snippet;
	}

	const { review, actions }: Props = $props();
</script>

<Card.Root class="flex flex-row max-sm:flex-col">
	<Card.Content class="shrink-0 !pr-0">
		<img
			src={review.film.posterPreviewUrl}
			alt="Film '{review.film.name}' poster"
			class="aspect-[2/3] h-40 rounded-sm object-cover max-sm:mx-auto max-sm:h-44"
		/>
	</Card.Content>

	<Card.Header class="flex flex-1 flex-col gap-2 !pb-6 max-sm:!pb-4 max-sm:pt-0 ">
		<div class="flex flex-row flex-wrap gap-2">
			<Card.Title class="text-lg">
				<Link isExternal target="_blank" href="https:/kinopoisk.ru/{review.film.id}"
					>{review.film.name}</Link
				>
			</Card.Title>
			<Badge class="w-fit text-sm" variant="secondary">
				{review.film.year}
			</Badge>
		</div>

		<div class="flex h-full flex-1 flex-col justify-between gap-4">
			<p>
				{review.description}
			</p>

			{@render actions?.()}
		</div>
	</Card.Header>
</Card.Root>
