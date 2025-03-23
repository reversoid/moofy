<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Link from '$lib/ui/link.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import type { ReviewDto } from '@repo/api/dtos';
	import type { Snippet } from 'svelte';
	import Image from '$lib/ui/image.svelte';
	import { Tag } from '../Tag';

	interface Props {
		review: ReviewDto;
		actions?: Snippet;
	}

	const { review, actions }: Props = $props();
</script>

<Card.Root class="flex h-full flex-row max-sm:flex-col">
	<Card.Content class="relative shrink-0 !pr-0 max-sm:mx-auto">
		<div class="relative">
			<Image
				src={review.film.posterPreviewUrl}
				alt="Film '{review.film.name}' poster"
				class="aspect-[2/3] h-40 rounded-sm object-cover max-sm:h-44"
			/>

			{#if review.score}
				<Badge
					class="absolute left-0 top-0 rounded-full rounded-bl-none rounded-tl-sm rounded-tr-none px-1 pl-0.5 pr-1 pt-0"
				>
					{review.score}
				</Badge>
			{/if}
		</div>
	</Card.Content>

	<Card.Header class="flex flex-1 flex-col gap-2 !pb-6 max-sm:!pb-4 max-sm:pt-0 ">
		<div class="flex flex-row flex-wrap gap-2">
			<Card.Title class="text-lg">
				<Link isExternal target="_blank" href="https://kinopoisk.ru/film/{review.film.id}"
					>{review.film.name}</Link
				>
			</Card.Title>
			<Badge class="w-fit text-sm" variant="outline">
				{review.film.year}
			</Badge>
		</div>

		<div class="mt-0 flex h-full flex-1 flex-col justify-between gap-6">
			{#if review.description}
				<p>{review.description}</p>
			{:else}
				<p class="text-muted-foreground">Описание отсутствует</p>
			{/if}

			<div class="flex flex-col gap-4">
				<div class="flex flex-wrap gap-2">
					{#each review.tags as tag}
						<Tag {tag} />
					{/each}
				</div>

				{@render actions?.()}
			</div>
		</div>
	</Card.Header>
</Card.Root>
