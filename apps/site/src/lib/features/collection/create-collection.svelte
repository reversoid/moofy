<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { CollectionDto } from '@repo/api/dtos';
	import CollectionModal from './collection-modal.svelte';
	import CreateCollectionButton from './create-collection-button.svelte';
	import { makeClient } from '$lib/shared/utils';

	interface Props {
		onCollectionCreated?: (collection: CollectionDto) => void;
	}

	async function createCollection(props: {
		name: string;
		description: string | null;
		isPublic: boolean;
		imageUrl: string | null;
	}) {
		const api = makeClient(fetch);
		const response = await api.collections.$post({
			json: {
				name: props.name,
				description: props.description,
				isPublic: props.isPublic,
				imageUrl: props.imageUrl
			}
		});

		if (response.ok) {
			const { collection } = await response.json();
			onCollectionCreated?.(collection);
			isOpen = false;
		}
	}

	const { onCollectionCreated }: Props = $props();

	let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="w-full">
		<CreateCollectionButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<CollectionModal onSubmit={createCollection} />
	</Dialog.Content>
</Dialog.Root>
