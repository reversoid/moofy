<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/shared/utils';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
	} = $props();
</script>

<div
	role="heading"
	aria-level={level}
	bind:this={ref}
	class={cn('text-2xl font-semibold leading-none tracking-tight max-md:text-xl', className)}
	{...restProps}
>
	{@render children?.()}
</div>
