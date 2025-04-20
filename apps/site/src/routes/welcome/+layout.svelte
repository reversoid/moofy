<script lang="ts">
	import { TabsLinkList, TabsLinkTrigger } from '$lib/components/ui/tabs';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Welcome | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Добро пожаловать!</Heading>

	<div class="mt-6">
		<TabsLinkList>
			<TabsLinkTrigger ariaLabel="Мои коллекции" href="collections">Мои коллекции</TabsLinkTrigger>
			<TabsLinkTrigger ariaLabel="Избранное" href="favorites">Избранное</TabsLinkTrigger>
			<TabsLinkTrigger ariaLabel="Суперколлекции" href="super">Суперколлекции</TabsLinkTrigger>
		</TabsLinkList>
	</div>

	<div class="mt-4">
		{@render children?.()}
	</div>
</Wrapper>
