<script lang="ts" module>
	export const tableRowClasses =
		'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors';
</script>

<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr bind:this={ref} class={cn(tableRowClasses, className)} {...restProps}>
	{@render children?.()}
</tr>
