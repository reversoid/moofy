<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		inputPrefix,
		...restProps
	}: WithElementRef<HTMLInputAttributes> & { inputPrefix?: Snippet } = $props();
</script>

<div
	class="focus-within:ring-ring focus-within:ring-offset-background relative flex w-full rounded-md focus-within:ring-2 focus-within:ring-offset-2"
>
	{#if inputPrefix}
		<div
			class="border-input bg-background text-muted-foreground flex items-center rounded-l-md border-y border-l px-3"
		>
			{@render inputPrefix?.()}
		</div>
	{/if}
	<input
		bind:this={ref}
		class={cn(
			'border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			inputPrefix && 'rounded-l-none border-l-0 pl-0',
			className
		)}
		bind:value
		{...restProps}
	/>
</div>
