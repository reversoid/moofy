<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import AuthButton from './auth-button.svelte';
	import AuthCard from './auth-card.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<AuthButton />
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Добро пожаловать!</Dialog.Title>
		</Dialog.Header>

		<AuthCard />
	</Dialog.Content>
</Dialog.Root>
