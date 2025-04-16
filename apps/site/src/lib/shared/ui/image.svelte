<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/shared/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLImageElement> {
		src: string;
		alt: string;
	}

	let { src, alt, class: className, ...restProps }: Props = $props();

	let isLoading = $state(true);
	let imageRef = $state<HTMLImageElement | null>(null);

	function onLoad() {
		isLoading = false;
	}
</script>

<div class="relative">
	{#if isLoading}
		<Skeleton class={cn('absolute inset-0 h-full w-full', className)} aria-hidden="true" />
	{/if}

	<img
		bind:this={imageRef}
		{src}
		{alt}
		class={cn(isLoading && 'invisible', className)}
		onload={onLoad}
		{...restProps}
	/>
</div>
