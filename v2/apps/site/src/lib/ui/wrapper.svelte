<script lang="ts">
	import { cn } from '$lib/utils';

	const className = $$props['class'];
	export { className as class };
</script>

<div class={cn('w-full max-w-screen-2xl px-4 max-sm:px-2', className)}>
	<slot />
</div>
