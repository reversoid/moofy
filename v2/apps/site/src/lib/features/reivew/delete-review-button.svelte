<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconLock, IconTrash } from '@tabler/icons-svelte';
	import { onDestroy } from 'svelte';

	let needConfirm = $state(false);
	let timeoutId: NodeJS.Timeout;

	function handleDeleteClick() {
		removeTimeout();
		needConfirm = true;

		timeoutId = setTimeout(() => {
			needConfirm = false;
		}, 3000);
	}

	const removeTimeout = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	};

	onDestroy(() => {
		removeTimeout();
	});
</script>

<Button
	type="button"
	aria-label={needConfirm ? 'Подтвердить удаление' : 'Удалить'}
	variant={needConfirm ? 'destructive' : 'outline'}
	onclick={handleDeleteClick}
>
	{#if needConfirm}
		<IconTrash />
	{:else}
		<IconLock />
	{/if}

	Удалить
</Button>
