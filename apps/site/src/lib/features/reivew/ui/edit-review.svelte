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

	let { existingReview = $bindable(), onReviewUpdated, onReviewDeleted, tags }: Props = $props();

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

		const existingIds = existingReview.tags.map((r) => r.id);
		const givenIds = form.tags ?? [];

		const addedTags = givenIds.filter((id) => !existingIds.includes(id));
		const deletedTags = existingIds?.filter((id) => !givenIds!.includes(id));

		const addTag = (tId: number) =>
			api.reviews[':reviewId'].tags[':tagId'].$put({
				param: { reviewId: existingReview.id.toString(), tagId: tId.toString() }
			});

		const deleteTag = (tId: number) =>
			api.reviews[':reviewId'].tags[':tagId'].$delete({
				param: { reviewId: existingReview.id.toString(), tagId: tId.toString() }
			});

		// TODO make method for batch tags set
		const responses = await Promise.all([...addedTags.map(addTag), ...deletedTags.map(deleteTag)]);

		if (!responses.every((r) => r.ok)) {
			return;
		}

		existingReview = {
			...existingReview,
			tags: tags.filter((t) => givenIds.includes(t.id))
		};
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
