<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { CollectionDto } from '@repo/api/dtos';
	import CollectionModal, { type CollectionForm } from './collection-modal.svelte';
	import EditCollectionButton from './edit-collection-button.svelte';
	import { handleResponse, makeClient } from '$lib/utils';

	interface Props {
		collection: CollectionDto;
		onCollectionUpdated?: (collection: CollectionDto) => void;
		onCollectionDeleted?: () => void;
	}

	const { onCollectionUpdated, onCollectionDeleted, collection }: Props = $props();

	async function updateCollection(props: CollectionForm) {
		const api = makeClient(fetch);
		const response = await api.collections[':id']
			.$patch({
				param: { id: String(collection.id) },
				json: {
					name: props.name,
					description: props.description,
					isPublic: props.isPublic,
					imageUrl: props.imageUrl
				}
			})
			.then(handleResponse);

		if (response.isOk()) {
			const collection = response.unwrap().collection;
			onCollectionUpdated?.(collection);
			isOpen = false;
		}
	}

	async function deleteCollection() {
		const api = makeClient(fetch);
		const response = await api.collections[':id']
			.$delete({ param: { id: String(collection.id) } })
			.then(handleResponse);

		if (response.isOk()) {
			onCollectionDeleted?.();
		}
	}

	let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<EditCollectionButton class="w-full" />
	</Dialog.Trigger>
	<Dialog.Content>
		<CollectionModal {collection} onSubmit={updateCollection} onDelete={deleteCollection} />
	</Dialog.Content>
</Dialog.Root>
