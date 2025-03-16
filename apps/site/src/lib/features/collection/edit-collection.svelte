<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { CollectionDto, TagDto } from '@repo/api/dtos';
	import CollectionModal, { type CollectionForm } from './collection-modal.svelte';
	import EditCollectionButton from './edit-collection-button.svelte';
	import { makeClient } from '$lib/utils';

	interface Props {
		collection: CollectionDto;
		tags: TagDto[];
		onCollectionUpdated?: (collection: CollectionDto) => void;
		onCollectionDeleted?: () => void;
	}

	const { onCollectionUpdated, onCollectionDeleted, collection, tags }: Props = $props();

	async function updateCollection(props: CollectionForm) {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].$patch({
			param: { collectionId: String(collection.id) },
			json: {
				name: props.name,
				description: props.description,
				isPublic: props.isPublic,
				imageUrl: props.imageUrl
			}
		});

		if (response.ok) {
			const { collection } = await response.json();
			onCollectionUpdated?.(collection);
			isOpen = false;
		}
	}

	async function deleteCollection() {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].$delete({
			param: { collectionId: String(collection.id) }
		});

		if (response.ok) {
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
		<CollectionModal {tags} {collection} onSubmit={updateCollection} onDelete={deleteCollection} />
	</Dialog.Content>
</Dialog.Root>
