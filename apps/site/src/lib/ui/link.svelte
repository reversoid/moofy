<script lang="ts">
	import { cn } from '$lib/utils';

	const className = $$props['class'];

	export let isExternal = false;
	export { className as class };

	const colorStyles = isExternal
		? 'text-blue-500 hover:text-blue-600'
		: 'text-neutral-400 hover:text-neutral-500';
</script>

<a {...$$restProps} class={cn(colorStyles, className)}>
	<slot />
</a>
