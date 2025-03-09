<script lang="ts">
	import type { WithoutChild } from 'bits-ui';
	import * as FormPrimitive from 'formsnap';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		children: childrenProp,
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<FormPrimitive.Label {...restProps} bind:ref>
	{#snippet children({ props })}
		<Label {...props} class={cn('data-[fs-error]:text-destructive', className)}>
			{@render childrenProp?.()}
		</Label>
	{/snippet}
</FormPrimitive.Label>
