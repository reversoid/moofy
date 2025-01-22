<script>
	import ReviewModal from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import EditReviewButton from './edit-review-button.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<EditReviewButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<ReviewModal type="edit" />
	</Dialog.Content>
</Dialog.Root>
