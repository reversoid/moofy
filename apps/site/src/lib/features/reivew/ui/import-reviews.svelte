<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconTransferIn } from '@tabler/icons-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ImportReviewsModal from './import-reviews-modal.svelte';
	import type { ReviewDto, TagDto } from '@repo/api/dtos';
	import { makeClient } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';

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

		onAddedReviews(addedReviews);

		isOpen = false;

		// TODO show modal on conflicts

		console.log({ addedReviews, conflictReviews });
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
			<div class="py-4">
				<ImportReviewsModal {tags} bind:selectedCollectionId bind:selectedTagsIds />
			</div>

			<Dialog.Footer>
				<Button {isLoading} onclick={handleSubmit} disabled={!selectedCollectionId}>Импорт</Button>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
