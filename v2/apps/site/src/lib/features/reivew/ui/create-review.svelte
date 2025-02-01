<script lang="ts">
	import ReviewModal, { type CompleteReviewForm } from './review-modal.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import CreateReviewButton from './create-review-button.svelte';
	import type { CollectionDto, ReviewDto } from '@repo/api/dtos';
	import { handleResponse, makeClient } from '$lib/utils';

	interface Props {
		collectionId: CollectionDto['id'];
		onReviewCreated: (review: ReviewDto) => void;
	}

	const { collectionId, onReviewCreated }: Props = $props();

	let isOpen = $state(false);

	async function createReview(form: CompleteReviewForm) {
		const api = makeClient(fetch);
		const reviewResult = await api.collections[':collectionId'].reviews
			.$post({
				json: { description: form.description, filmId: Number(form.film.id), score: form.score },
				param: { collectionId: String(collectionId) }
			})
			.then(handleResponse);

		if (reviewResult.isOk()) {
			const review = reviewResult.unwrap().review;
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
