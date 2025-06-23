<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };

	const { children }: Props = $props();
</script>

<div
	class="absolute left-[50%] top-[50%] z-10 w-[25%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-gray-400 bg-opacity-50 p-4 backdrop-blur-sm"
>
	{@render children()}
</div>
