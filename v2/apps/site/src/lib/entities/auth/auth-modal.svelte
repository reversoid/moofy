<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Snippet } from 'svelte';
	import AuthCard from './auth-card.svelte';

	interface Props {
		trigger: Snippet;
	}

	let { trigger }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render trigger()}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Добро пожаловать!</Dialog.Title>
		</Dialog.Header>

		<AuthCard />
	</Dialog.Content>
</Dialog.Root>
