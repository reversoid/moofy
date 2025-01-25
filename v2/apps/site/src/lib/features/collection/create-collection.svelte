<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import CollectionModal from './collection-modal.svelte';
	import CreateCollectionButton from './create-collection-button.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<CreateCollectionButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<CollectionModal type="create" />
	</Dialog.Content>
</Dialog.Root>
