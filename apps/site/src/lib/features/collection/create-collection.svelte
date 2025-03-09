<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { CollectionDto } from '@repo/api/dtos';
	import CollectionModal from './collection-modal.svelte';
	import CreateCollectionButton from './create-collection-button.svelte';
	import { handleResponse, makeClient } from '$lib/utils';

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
		const response = await api.collections
			.$post({
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
