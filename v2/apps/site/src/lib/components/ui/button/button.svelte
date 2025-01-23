<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';

	export { className as class };

	export let tag: keyof HTMLElementTagNameMap = 'button';
</script>

<svelte:element
	this={tag}
	tabindex="0"
	role="button"
	{...$$restProps}
	class={cn(buttonVariants({ variant, size, className }))}
	on:click
	type="button"
>
	<slot />
</svelte:element>
