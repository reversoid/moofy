<script>
	import Wrapper from '$lib/ui/wrapper.svelte';
	import Heading from '$lib/ui/heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { IconLayoutList, IconTimeline } from '@tabler/icons-svelte';
</script>

<svelte:head>
	<title>About | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>О нас</Heading>

	<p class="text-muted-foreground mt-4">
		Moofy - это платформа, где пользователи могут создавать, редактировать и делиться своими
		коллекциями фильмов с другими пользователями.
	</p>

	<div class="mt-4 flex gap-2">
		<Button class="rounded-full" href="/roadmap"><IconTimeline /> Roadmap</Button>
		<Button class="rounded-full" href="/changelog"><IconLayoutList /> Обновления</Button>
	</div>
</Wrapper>
