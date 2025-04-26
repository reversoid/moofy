<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconTransferIn } from '@tabler/icons-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ImportReviewsModal from './import-reviews-modal.svelte';
	import type { ReviewDto, TagDto } from '@repo/api/dtos';
	import { makeClient } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';

	// TODO implement i118n
	function generateResultMessage(props: {
		addedReviewsAmount: number;
		conflictReviewsAmount: number;
	}) {
		function getReviewWordForm(count: number) {
			const absCount = Math.abs(count);
			const lastDigit = absCount % 10;
			const lastTwoDigits = absCount % 100;

			if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
				return 'обзоров';
			}

			if (lastDigit === 1) {
				return 'обзор';
			} else if (lastDigit >= 2 && lastDigit <= 4) {
				return 'обзора';
			} else {
				return 'обзоров';
			}
		}

		function getAddedPrefix(count: number) {
			const absCount = Math.abs(count);
			const lastDigit = absCount % 10;
			const lastTwoDigits = absCount % 100;

			if (lastDigit === 1 && lastTwoDigits !== 11) {
				return 'добавлен';
			} else {
				return 'добавлено';
			}
		}

		function getExistsForm(count: number) {
			const absCount = Math.abs(count);
			const lastDigit = absCount % 10;
			const lastTwoDigits = absCount % 100;

			if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
				return 'существует';
			}

			if (lastDigit === 1) {
				return 'существует';
			} else {
				return 'существуют';
			}
		}

		function capitalize(str: string) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}

		const addedSentence = `${capitalize(getAddedPrefix(props.addedReviewsAmount))} ${props.addedReviewsAmount} ${getReviewWordForm(props.addedReviewsAmount)}.`;

		if (props.conflictReviewsAmount === 0) {
			return addedSentence;
		}

		const conflictSentence = `${props.conflictReviewsAmount} ${getReviewWordForm(props.conflictReviewsAmount)} уже ${getExistsForm(props.conflictReviewsAmount)}.`;

		return `${addedSentence} ${conflictSentence}`;
	}

	let selectedCollectionId = $state<string>();
	let selectedTagsIds = $state<string[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);

	type Props = {
		tags: TagDto[];
		onAddedReviews: (reviews: ReviewDto[]) => void;
	};

	const { tags, onAddedReviews }: Props = $props();

	async function handleSubmit() {
		if (!selectedCollectionId) {
			return;
		}

		const api = makeClient(fetch);

		isLoading = true;

		const result = await api.profile['personal-collection'].merge.$post({
			json: {
				collectionId: Number(selectedCollectionId),
				assignTagsIds: selectedTagsIds.map(Number)
			}
		});

		isLoading = false;

		if (!result.ok) {
			toast.error('Не удалось импортировать коллекции');
			return;
		}

		const { addedReviews, conflictReviews } = await result.json();

		console.log({ addedReviews, conflictReviews });

		onAddedReviews(addedReviews);

		isOpen = false;

		toast.info(
			generateResultMessage({
				addedReviewsAmount: addedReviews.length,
				conflictReviewsAmount: conflictReviews.length
			})
		);
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<Button tag="div" class="max-sm:hidden">
			<IconTransferIn size="20" />
			<span>Импорт</span>
		</Button>

		<Button tag="div" size="icon" class="hidden items-center justify-center max-sm:flex">
			<IconTransferIn />
		</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Импорт обзоров</Dialog.Title>
		</Dialog.Header>

		<div class="py-4">
			<ImportReviewsModal {tags} bind:selectedCollectionId bind:selectedTagsIds />
		</div>

		<Dialog.Footer>
			<Button {isLoading} onclick={handleSubmit} disabled={!selectedCollectionId}>Импорт</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
