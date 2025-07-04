<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };

	const { children }: Props = $props();
</script>

<div
	class="text-primary absolute z-10 size-12 rounded-full bg-gray-400 bg-opacity-50 p-3 backdrop-blur-sm"
>
	{@render children()}
</div>
