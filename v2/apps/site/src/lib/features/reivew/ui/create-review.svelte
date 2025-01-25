<script>
	import ReviewModal from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import CreateReviewButton from './create-review-button.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<CreateReviewButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<ReviewModal type="create" />
	</Dialog.Content>
</Dialog.Root>
