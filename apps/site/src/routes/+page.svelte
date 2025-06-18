<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
</script>

<svelte:head>
	<title>Moofy</title>
</svelte:head>

<Wrapper class="min-h-[inherit]">
	<Wrapper
		class="bg-muted relative flex min-h-[inherit] flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl"
	>
		<div class="absolute inset-0 z-0">
			<video
				autoplay
				loop
				muted
				playsinline
				class="h-full w-full object-cover opacity-30 blur-md brightness-50 grayscale"
			>
				<source src="/output.webm" type="video/webm" />
				<!-- <source src="/background.mp4" type="video/mp4" /> -->
			</video>
		</div>

		<div class="z-10 flex flex-col items-center justify-center gap-10">
			<div class="flex flex-col items-center justify-center gap-5">
				<Heading class="text-center">Создавай коллекции фильмов</Heading>
			</div>

			<Button href="/collections" size="lg" class="w-64">
				<span>Начать</span>
			</Button>
		</div>
	</Wrapper>
</Wrapper>
