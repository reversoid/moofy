<script lang="ts">
	import { TabsLinkList, TabsLinkTrigger } from '$lib/components/ui/tabs';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Search | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Поиск</Heading>

	<div class="mt-6">
		<TabsLinkList>
			<TabsLinkTrigger ariaLabel="Пользователи" href="/search/profiles"
				>Пользователи</TabsLinkTrigger
			>
			<TabsLinkTrigger ariaLabel="Коллекции" href="/search/collections">Коллекции</TabsLinkTrigger>
		</TabsLinkList>
	</div>

	<div class="mt-4">
		{@render children()}
	</div>
</Wrapper>
