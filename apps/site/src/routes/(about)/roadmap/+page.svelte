<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const roadmap = data.roadmap;
</script>

<svelte:head>
	<title>Roadmap | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Roadmap</Heading>

	<p class="text-muted-foreground mt-4">
		Мы постоянно работаем над улучшением нашего сервиса и добавлением новых функций.
		<br /> Здесь вы можете узнать о том, что мы планируем добавить в будущем.
	</p>

	<div class="roadmap-items mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-2">
		{#each roadmap as item}
			<div class="bg-muted rounded-md p-4">
				<h3 class="text-lg font-bold">{item.title}</h3>
				<p class="text-muted-foreground">
					{item.description}
				</p>
			</div>
		{:else}
			<p class="text-muted-foreground">Список пуст...</p>
		{/each}
	</div>
</Wrapper>
