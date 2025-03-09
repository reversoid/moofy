<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { IconLock, IconTrash } from '@tabler/icons-svelte';
	import { onDestroy } from 'svelte';

	let confirmedDelete = $state(false);
	let timeoutId: NodeJS.Timeout;

	export type DeleteButtonProps = {
		onDelete?: () => void;
		class?: string;
		type?: 'submit' | 'button';
		form?: string;
		isLoading?: boolean;
	};

	const {
		onDelete,
		class: className,
		type = 'button',
		form,
		isLoading
	}: DeleteButtonProps = $props();

	function handleDeleteClick() {
		if (confirmedDelete) {
			onDelete?.();
			return;
		}

		removeTimeout();
		confirmedDelete = true;

		timeoutId = setTimeout(() => {
			confirmedDelete = false;
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
	{isLoading}
	class={className}
	{type}
	{form}
	aria-label={confirmedDelete ? 'Подтвердить удаление' : 'Удалить'}
	variant={confirmedDelete ? 'destructive' : 'outline'}
	onclick={handleDeleteClick}
>
	{#if confirmedDelete}
		<IconTrash />
	{:else}
		<IconLock />
	{/if}

	Удалить
</Button>
