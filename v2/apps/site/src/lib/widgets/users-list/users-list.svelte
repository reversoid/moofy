<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { UserCard } from '$lib/entities/user-card';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import type { UserDto } from '@repo/api/dtos';
	import { IconSearch } from '@tabler/icons-svelte';
	import debounce from 'lodash.debounce';
	import { flip } from 'svelte/animate';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		users: UserDto[];
		cursor?: string | null;
		disableAutoLoad?: boolean;

		onLoadMore?: (cursor: string) => Promise<void>;
		onSearch?: (search: string) => Promise<void>;
	}

	const { users, disableAutoLoad = false, onLoadMore, onSearch, cursor }: Props = $props();

	let isLoading = $state(false);

	let isSearching = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}

	// TODO make search component
	const handleInput = debounce(async (e: Parameters<FormEventHandler<HTMLInputElement>>[0]) => {
		isSearching = true;
		await onSearch?.((e.target as HTMLInputElement).value);
		isSearching = false;
	}, 300);
</script>

<div class="flex flex-col gap-4">
	<Input oninput={handleInput} placeholder="Поиск">
		{#snippet inputPrefix()}
			<IconSearch size={20} />
		{/snippet}
	</Input>

	<div
		class="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-2"
	>
		{#each users as user (user.id)}
			<div animate:flip={{ duration: 350 }}>
				<UserCard
					username={user.username}
					description={user.description}
					imageUrl={user.imageUrl}
				/>
			</div>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {isLoading} {cursor} {disableAutoLoad} onLoadMore={onLoadMoreWithLoading} />
	{/if}
</div>
