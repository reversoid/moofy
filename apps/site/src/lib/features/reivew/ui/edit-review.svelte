<script lang="ts">
	import ReviewModal, { type ReviewForm } from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import EditReviewButton from './edit-review-button.svelte';
	import type { ReviewDto } from '@repo/api/dtos';
	import { handleResponse, makeClient } from '$lib/utils';

	interface Props {
		existingReview: ReviewDto;
		onReviewUpdated: (review: ReviewDto) => void;
		onReviewDeleted: (reviewId: ReviewDto['id']) => void;
	}

	const { existingReview, onReviewUpdated, onReviewDeleted }: Props = $props();

	let isOpen = $state(false);

	async function editReview(form: ReviewForm) {
		const api = makeClient(fetch);
		const reviewResult = await api.reviews[':reviewId']
			.$patch({
				json: { description: form.description || null, score: form.score },
				param: { reviewId: String(existingReview.id) }
			})
			.then(handleResponse);

		if (reviewResult.isOk()) {
			const updatedReview = reviewResult.unwrap().review;
			onReviewUpdated(updatedReview);
			isOpen = false;
		}
	}

	async function deleteReview(id: ReviewDto['id']) {
		const api = makeClient(fetch);
		const result = await api.reviews[':reviewId']
			.$delete({ param: { reviewId: String(id) } })
			.then(handleResponse);

		if (result.isOk()) {
			onReviewDeleted(id);
			isOpen = false;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<EditReviewButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<ReviewModal {existingReview} onSubmit={editReview} onSubmitDelete={deleteReview} />
	</Dialog.Content>
</Dialog.Root>
