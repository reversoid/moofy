<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { makeClient } from '$lib/shared/utils';
	import type { UserDto } from '@repo/api/dtos';
	import { IconUserMinus, IconUserPlus } from '@tabler/icons-svelte';

	interface Props {
		userId: UserDto['id'];
		isFollowing: boolean;
		disabled?: boolean;
	}

	const { userId, isFollowing: initialIsFollowing, disabled = false }: Props = $props();

	const api = makeClient(fetch);

	let isLoading = $state(false);

	let isFollowing = $state(initialIsFollowing);

	async function follow(e: MouseEvent) {
		e.preventDefault();

		isLoading = true;

		const response = await api.users[':id'].followers.$put({
			param: { id: String(userId) }
		});

		if (response.ok) {
			isFollowing = true;
		} else {
			const { error } = await response.json();

			if (error === 'ALREADY_FOLLOWING') {
				isFollowing = true;
			}
		}

		isLoading = false;
	}

	async function unfollow(e: MouseEvent) {
		e.preventDefault();

		isLoading = true;

		const response = await api.users[':id'].followers.$delete({
			param: { id: String(userId) }
		});

		if (response.ok) {
			isFollowing = false;
		} else {
			const { error } = await response.json();

			if (error === 'NOT_FOLLOWING') {
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
	{disabled}
>
	{#if isFollowing}
		<IconUserMinus />
		<span>Отписаться</span>
	{:else}
		<IconUserPlus />
		<span>Подписаться</span>
	{/if}
</Button>
