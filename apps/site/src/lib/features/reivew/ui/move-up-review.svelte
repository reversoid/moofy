<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { makeClient } from '$lib/shared/utils';
	import type { ReviewDto } from '@repo/api/dtos';
	import { IconArrowUp } from '@tabler/icons-svelte';

	type Props = {
		reviewId: ReviewDto['id'];
		onMoveTop?: (id: ReviewDto['id']) => void;
	};

	const { reviewId, onMoveTop }: Props = $props();

	let isLoading = $state(false);

	async function moveUp() {
		const api = makeClient(fetch);

		isLoading = true;

		const response = await api.reviews[':reviewId'].$patch({
			json: { updatePosition: true },
			param: { reviewId: reviewId.toString() }
		});

		isLoading = false;

		if (!response.ok) {
			return;
		}

		onMoveTop?.(reviewId);
	}
</script>

<!-- <Button onclick={moveUp} {isLoading} class="!ml-0 sm:hidden" variant="outline">
	<IconArrowUp />
	<span>Наверх</span>
</Button> -->

<Button onclick={moveUp} {isLoading} size="icon" variant="outline">
	<IconArrowUp />
</Button>
