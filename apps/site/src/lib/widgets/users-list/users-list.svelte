<script lang="ts">
	import { UserCard } from '$lib/entities/user-card';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import Search from '$lib/ui/search.svelte';
	import type { UserDto } from '@repo/api/dtos';
	import { flip } from 'svelte/animate';
	import * as Alert from '$lib/components/ui/alert';
	import { IconPercentage0 } from '@tabler/icons-svelte';

	interface Props {
		users: { user: UserDto; isFollowing: boolean }[];
		cursor?: string | null;
		disableAutoLoad?: boolean;

		onLoadMore?: (cursor: string) => Promise<void>;
		onSearch?: (search: string) => Promise<void>;
		defaultEmptyDescription: string;
	}

	const {
		users,
		disableAutoLoad = false,
		onLoadMore,
		onSearch,
		cursor,
		defaultEmptyDescription
	}: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}

	let isSearch = $state(false);
	async function handleSearch(search: string) {
		await onSearch?.(search);
		isSearch = Boolean(search);
	}

	const emptyListDescription = $derived(
		`${isSearch ? 'Попробуйте изменить параметры поиска' : defaultEmptyDescription}`
	);
</script>

<div class="flex flex-col gap-4">
	<Search onSearch={handleSearch} />

	{#if users.length === 0}
		<Alert.Root>
			<IconPercentage0 size={20} />
			<Alert.Title>Пользователей не найдено</Alert.Title>
			<Alert.Description>{emptyListDescription}</Alert.Description>
		</Alert.Root>
	{/if}

	<div
		class="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-2"
	>
		{#each users as { user, isFollowing } (user.id)}
			<div animate:flip={{ duration: 350 }}>
				<UserCard
					userId={user.id}
					username={user.username}
					description={user.description}
					imageUrl={user.imageUrl}
					{isFollowing}
				/>
			</div>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {isLoading} {cursor} {disableAutoLoad} onLoadMore={onLoadMoreWithLoading} />
	{/if}
</div>
