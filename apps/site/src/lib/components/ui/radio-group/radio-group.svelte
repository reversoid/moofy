<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn } from '$lib/shared/utils';

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(''),
		...restProps
	}: RadioGroupPrimitive.RootProps = $props();
</script>

<RadioGroupPrimitive.Root bind:ref bind:value class={cn('grid gap-2', className)} {...restProps} />
