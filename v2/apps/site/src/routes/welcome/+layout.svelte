<script lang="ts">
	import { TabsLinkList, TabsLinkTrigger } from '$lib/components/ui/tabs';
	import Heading from '$lib/ui/heading.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';

	let { children } = $props();
</script>

<Wrapper>
	<Heading>Добро пожаловать!</Heading>

	<div class="mt-6">
		<TabsLinkList>
			<TabsLinkTrigger ariaLabel="Мои коллекции" href="collections">Мои коллекции</TabsLinkTrigger>
			<TabsLinkTrigger ariaLabel="Избранное" href="favorites">Избранное</TabsLinkTrigger>
		</TabsLinkList>
	</div>

	<div class="mt-4">
		{@render children?.()}
	</div>
</Wrapper>
