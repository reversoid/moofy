<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageProps } from './$types';

	const { children, data }: PageProps & { children: Snippet } = $props();
</script>

<svelte:head>
	<title>{data.profile.username} | Moofy</title>
</svelte:head>

{@render children()}
