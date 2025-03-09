<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1"
>
	{@render children?.()}
</div>
