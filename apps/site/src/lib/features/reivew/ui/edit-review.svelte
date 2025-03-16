<script lang="ts">
	import ReviewModal, { type ReviewForm } from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import EditReviewButton from './edit-review-button.svelte';
	import type { ReviewDto, TagDto } from '@repo/api/dtos';
	import { makeClient } from '$lib/utils';

	interface Props {
		existingReview: ReviewDto;
		tags: TagDto[];
		onReviewUpdated: (review: ReviewDto) => void;
		onReviewDeleted: (reviewId: ReviewDto['id']) => void;
	}

	const { existingReview, onReviewUpdated, onReviewDeleted, tags }: Props = $props();

	let isOpen = $state(false);

	async function editReview(form: ReviewForm) {
		const api = makeClient(fetch);
		const reviewResult = await api.reviews[':reviewId'].$patch({
			json: { description: form.description || null, score: form.score },
			param: { reviewId: String(existingReview.id) }
		});

		if (reviewResult.ok) {
			const { review: updatedReview } = await reviewResult.json();
			onReviewUpdated(updatedReview);
			isOpen = false;
		}
	}

	async function deleteReview(id: ReviewDto['id']) {
		const api = makeClient(fetch);
		const result = await api.reviews[':reviewId'].$delete({ param: { reviewId: String(id) } });

		if (result.ok) {
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
		<ReviewModal {tags} {existingReview} onSubmit={editReview} onSubmitDelete={deleteReview} />
	</Dialog.Content>
</Dialog.Root>
