<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconChevronDown } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';

	const THRESHOLD = 200;

	let loadMoreButton: HTMLButtonElement | null = $state(null);

	let isLoading = $state(false);

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				console.log('Button is visible within threshold');
			}
		});
	}

	onMount(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			rootMargin: `${THRESHOLD}px`
		});

		if (loadMoreButton) {
			observer.observe(loadMoreButton);
		}

		return () => {
			if (loadMoreButton) {
				observer.unobserve(loadMoreButton);
			}
		};
	});
</script>

<Button
	bind:ref={loadMoreButton}
	variant="outline"
	{isLoading}
	onclick={() => (isLoading = !isLoading)}
>
	<IconChevronDown />
	Загрузить больше
</Button>
