<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import CollectionModal from './collection-modal.svelte';
	import EditCollectionButton from './edit-collection-button.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<EditCollectionButton class="w-full" />
	</Dialog.Trigger>
	<Dialog.Content>
		<CollectionModal type="edit" />
	</Dialog.Content>
</Dialog.Root>
