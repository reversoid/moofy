<script lang="ts">
	import Wrapper from '$lib/ui/wrapper.svelte';
	import * as Card from '$lib/components/ui/card';
	import Heading from '$lib/ui/heading.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { makeClient } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';

	const { data }: PageProps = $props();

	const changelogs = $derived(data.changelogList);

	onMount(() => {
		void makeClient(fetch).changelog.views.$post({});
	});
</script>

<svelte:head>
	<title>Changelog | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Список изменений</Heading>

	<p class="text-muted-foreground mt-4">
		На этой странице вы можете увидеть список всех недавних обновлений
	</p>

	<div class="mt-4 flex flex-col gap-2">
		{#each changelogs as changelog}
			<Card.Root>
				<Card.Header>
					<Card.Title>{changelog.version}</Card.Title>
					<Card.Description>{changelog.releaseDate.split('T')[0]}</Card.Description>
				</Card.Header>

				<Card.Content>
					<div class="changelog-content">
						{@html changelog.description}
					</div>

					<div class="mt-6 flex flex-row gap-2">
						{#if changelog.hasFeature}
							<Badge class="bg-violet-500" variant="secondary">Новое</Badge>
						{/if}

						{#if changelog.hasImprovement}
							<Badge class="bg-green-500" variant="secondary">Улучшения</Badge>
						{/if}

						{#if changelog.hasBugfix}
							<Badge class="bg-slate-500" variant="secondary">Исправления</Badge>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<p class="text-muted-foreground">Список пока пуст</p>
		{/each}
	</div>
</Wrapper>

<style>
	.changelog-content :global {
		h3 {
			@apply mb-0.5 font-semibold md:text-lg;
		}

		ul {
			@apply mb-2 list-inside list-disc;
		}
	}
</style>
