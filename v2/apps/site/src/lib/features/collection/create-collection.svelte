<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import CreateCollectionButton from './create-collection-button.svelte';

	import CreateCollectionModal from './create-collection-modal.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<CreateCollectionButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<CreateCollectionModal />
	</Dialog.Content>
</Dialog.Root>
