<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';

	import * as Tabs from '$lib/components/ui/tabs/index';
</script>

<!-- TOOD some fetch logic -->

<Wrapper>
	<Heading>Добро пожаловать!</Heading>

	<Tabs.Root value="my-collections" class="mt-6">
		<Tabs.List>
			<Tabs.Trigger value="my-collections">Мои коллекции</Tabs.Trigger>
			<Tabs.Trigger value="favorites">Избранное</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="my-collections">
			<div class="mt-4">
				<CollectionsGrid />
			</div>
		</Tabs.Content>
		<Tabs.Content value="favorites">
			<div class="mt-4">
				<CollectionsGrid />
			</div>
		</Tabs.Content>
	</Tabs.Root>
</Wrapper>
