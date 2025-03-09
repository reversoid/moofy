<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconChevronDown } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';

	interface Props {
		disableAutoLoad?: boolean;
		isLoading?: boolean;
		cursor?: string | null;
		onLoadMore?: (cursor: string) => void;
	}

	const THRESHOLD = 200;

	let { disableAutoLoad = false, isLoading = false, cursor, onLoadMore }: Props = $props();

	let loadMoreButton: HTMLButtonElement | null = $state(null);

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			if (entry.isIntersecting && cursor && !isLoading) {
				onLoadMore?.(cursor);
			}
		});
	}

	onMount(() => {
		if (disableAutoLoad) {
			return;
		}

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
	onclick={() => cursor && !isLoading && onLoadMore?.(cursor)}
	bind:ref={loadMoreButton}
	variant="outline"
	{isLoading}
>
	<IconChevronDown />
	Загрузить больше
</Button>
