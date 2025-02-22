<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PageProps } from './$types';

	const { children, data }: PageProps & { children: Snippet } = $props();

	$inspect(data);
</script>

<svelte:head>
	<title>{data.profile.username} | Moofy</title>
</svelte:head>

{@render children()}
