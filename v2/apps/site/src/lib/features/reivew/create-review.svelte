<script>
	import CreateReviewModal from './create-review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import CreateReviewButton from './create-review-button.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<CreateReviewButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<CreateReviewModal />
	</Dialog.Content>
</Dialog.Root>
