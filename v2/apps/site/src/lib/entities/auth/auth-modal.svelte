<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Snippet } from 'svelte';
	import AuthCard from './auth-card.svelte';
	import { setCurrentUser } from '$lib/state/state.svelte';

	interface Props {
		trigger: Snippet;
	}

	let { trigger }: Props = $props();

	let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="w-full">
		{@render trigger()}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Добро пожаловать!</Dialog.Title>
		</Dialog.Header>

		<AuthCard
			onSuccess={(user) => {
				setCurrentUser(user);
				isOpen = false;
			}}
		/>
	</Dialog.Content>
</Dialog.Root>
