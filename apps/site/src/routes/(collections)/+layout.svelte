<script lang="ts">
	import Wrapper from '$lib/shared/ui/wrapper.svelte';

	const { children } = $props();
</script>

<Wrapper>
	{@render children()}
</Wrapper>
