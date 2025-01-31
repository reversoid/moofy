<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { handleResponse, makeClient } from '$lib/utils';
	import type { UserDto } from '@repo/api/dtos';
	import { IconUserMinus, IconUserPlus } from '@tabler/icons-svelte';

	interface Props {
		userId: UserDto['id'];
		isFollowing: boolean;
	}

	const { userId, isFollowing: initialIsFollowing }: Props = $props();

	const api = makeClient(fetch);

	let isLoading = $state(false);

	let isFollowing = $state(initialIsFollowing);

	async function follow(e: MouseEvent) {
		e.preventDefault();

		isLoading = true;

		const response = await api.users[':id'].followers
			.$put({
				param: { id: String(userId) }
			})
			.then(handleResponse);

		if (response.isOk()) {
			isFollowing = true;
		} else {
			if (response.error.error === 'ALREADY_FOLLOWING') {
				isFollowing = true;
			}
		}

		isLoading = false;
	}

	async function unfollow(e: MouseEvent) {
		e.preventDefault();

		isLoading = true;

		const response = await api.users[':id'].followers
			.$delete({
				param: { id: String(userId) }
			})
			.then(handleResponse);

		if (response.isOk()) {
			isFollowing = false;
		} else {
			if (response.error.error === 'NOT_FOLLOWING') {
				isFollowing = false;
			}
		}

		isLoading = false;
	}
</script>

<Button
	variant={isFollowing ? 'outline' : 'default'}
	class="w-full"
	onclick={isFollowing ? unfollow : follow}
	{isLoading}
>
	{#if isFollowing}
		<IconUserMinus />
		<span>Отписаться</span>
	{:else}
		<IconUserPlus />
		<span>Подписаться</span>
	{/if}
</Button>
