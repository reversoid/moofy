<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconTrash } from '@tabler/icons-svelte';
	import { onDestroy } from 'svelte';

	type Props = {
		onConfirmedDelete: () => void;
	};

	const { onConfirmedDelete }: Props = $props();

	let confirmedDelete = $state(false);
	let timeoutId = $state<NodeJS.Timeout | null>(null);

	const handleDeleteClick = () => {
		if (confirmedDelete) {
			onConfirmedDelete?.();
			return;
		}

		removeTimeout();
		confirmedDelete = true;

		timeoutId = setTimeout(() => {
			confirmedDelete = false;
		}, 3000);
	};

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
	size="icon"
	onclick={handleDeleteClick}
	variant={confirmedDelete ? 'destructive' : 'outline'}
>
	<IconTrash />
</Button>
