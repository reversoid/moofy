<script lang="ts">
	import { cn } from '$lib/shared/utils';

	const className = $$props['class'];
	export { className as class };
</script>

<div class={cn('mx-auto w-full max-w-screen-2xl px-5 max-sm:px-2', className)}>
	<slot />
</div>
