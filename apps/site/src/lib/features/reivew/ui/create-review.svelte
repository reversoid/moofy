<script lang="ts">
	import ReviewModal, { type ReviewForm } from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import CreateReviewButton from './create-review-button.svelte';
	import type { CollectionDto, ReviewDto } from '@repo/api/dtos';
	import { makeClient } from '$lib/shared/utils';

	interface Props {
		collectionId: CollectionDto['id'];
		onReviewCreated: (review: ReviewDto) => void;
	}

	const { collectionId, onReviewCreated }: Props = $props();

	let isOpen = $state(false);

	async function createReview(form: ReviewForm) {
		const api = makeClient(fetch);
		const reviewResult = await api.collections[':collectionId'].reviews.$post({
			json: {
				description: form.description || null,
				filmId: Number(form.filmId),
				score: form.score
			},
			param: { collectionId: String(collectionId) }
		});

		if (reviewResult.ok) {
			const { review } = await reviewResult.json();
			onReviewCreated(review);
			isOpen = false;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<CreateReviewButton />
	</Dialog.Trigger>
	<Dialog.Content>
		<ReviewModal onSubmit={createReview} />
	</Dialog.Content>
</Dialog.Root>
