<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { makeClient } from '$lib/shared/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconArrowUp } from '@tabler/icons-svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		collectionId: CollectionDto['id'];
	};

	const { collectionId }: Props = $props();

	let isLoading = $state(false);

	async function moveUp() {
		const api = makeClient(fetch);

		isLoading = true;

		const response = await api.collections[':collectionId'].$patch({
			json: { updatePosition: true },
			param: { collectionId: collectionId.toString() }
		});

		isLoading = false;

		if (!response.ok) {
			return;
		}

		toast.info('Коллекция перемещена наверх профиля');
	}
</script>

<Button {isLoading} onclick={moveUp} variant="outline" size="icon">
	<IconArrowUp />
</Button>
