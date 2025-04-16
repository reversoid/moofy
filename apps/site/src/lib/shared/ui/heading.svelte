<script lang="ts">
	export let type: 'h1' | 'h2' = 'h1';
	import { cn } from '$lib/shared/utils';

	const className = $$props['class'];
	export { className as class };
</script>

{#if type === 'h1'}
	<h1 class={cn('text-5xl font-semibold max-sm:text-4xl', className)}><slot /></h1>
{/if}

{#if type === 'h2'}
	<h2 class={cn('text-4xl font-semibold max-sm:text-3xl', className)}><slot /></h2>
{/if}
