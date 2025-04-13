<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/shared/utils';
	import type { Snippet } from 'svelte';
	import { IconLoader2 } from '@tabler/icons-svelte';
	import type { Action } from 'svelte/action';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		inputPrefix,
		isLoading = false,
		use = () => {},
		...restProps
	}: WithElementRef<HTMLInputAttributes> & {
		use?: Action;
		inputPrefix?: Snippet;
		isLoading?: boolean;
	} = $props();
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
		use:use
		bind:this={ref}
		class={cn(
			'border-input bg-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			inputPrefix && 'rounded-l-none border-l-0 pl-0',
			isLoading && 'pr-10',
			className
		)}
		bind:value
		{...restProps}
	/>

	{#if isLoading}
		<div class="absolute inset-y-0 right-0 flex items-center pr-3">
			<IconLoader2 class="text-muted-foreground animate-spin" />
		</div>
	{/if}
</div>
