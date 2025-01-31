<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import { IconUser } from '@tabler/icons-svelte';
	import type { PageProps } from './$types';
	import { handleResponse, makeClient } from '$lib/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import CreateCollectionCard from '$lib/features/collection/create-collection-card.svelte';
	import { FollowButton } from '$lib/features/profile';

	const { data }: PageProps = $props();

	const initialCollections = $derived(data.collections);
	const initialFavoriteCollections = $derived(data.favoriteCollections);
	const profile = $derived(data.profile);
	const currentUser = $derived(data.user);
	const social = $derived(data.social);

	let collections = $state(data.collections);
	let favoriteCollections = $state(data.favoriteCollections);

	async function searchCollections(search: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.users[':id'].collections
			.$get({
				param: { id: String(profile.id) },
				query: { search }
			})
			.then(handleResponse);

		collections = collectionsResult.unwrap().collections;
	}

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.users[':id'].collections
			.$get({
				param: { id: String(profile.id) },
				query: { cursor, limit: '8' }
			})
			.then(handleResponse);

		const newCollections = collectionsResult.unwrap().collections;

		collections = {
			items: [...initialCollections.items, ...newCollections.items],
			cursor: newCollections.cursor
		};
	}

	async function handleCollectionCreated(collection: CollectionDto) {
		initialCollections.items.unshift(collection);
	}

	async function searchFavoriteCollections(search: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.favorites
			.$get({
				query: { search }
			})
			.then(handleResponse);

		favoriteCollections = collectionsResult.unwrap().collections;
	}

	async function loadFavoriteCollections(cursor?: string) {
		if (!initialFavoriteCollections) return;

		const api = makeClient(fetch);

		const collectionsResult = await api.favorites
			.$get({ query: { cursor, limit: '8' } })
			.then(handleResponse);

		const newCollections = collectionsResult.unwrap().collections;

		favoriteCollections = {
			items: [...initialFavoriteCollections.items, ...newCollections.items],
			cursor: newCollections.cursor
		};
	}

	const isOwner = $derived(profile.id === currentUser?.id);
</script>

<Wrapper>
	<div
		class="grid grid-cols-[1fr_5fr] gap-12 max-xl:grid-cols-[1fr_4fr] max-xl:gap-10 max-lg:grid-cols-[1fr_3fr] max-md:grid-cols-1"
	>
		<div class="flex flex-col gap-5 max-md:items-center">
			{#if profile.imageUrl}
				<img
					src={profile.imageUrl}
					alt="Profile avatar"
					class="bg-muted flex aspect-square w-full items-center justify-center rounded-full object-cover text-center max-md:size-36"
				/>
			{:else}
				<div class="bg-muted aspect-square w-full rounded-full object-cover max-md:size-36">
					<IconUser />
				</div>
			{/if}

			<h1 class="text-center text-2xl font-medium">{profile.username}</h1>

			<ul class="flex flex-col justify-between gap-1 text-sm">
				<li class="text-center">
					<Link href="followers">
						<span>Подписчики</span>
						<span>{social.followers}</span>
					</Link>
				</li>

				<li class="text-center">
					<Link href="followees">
						<span>Подписки</span>
						<span>{social.followees}</span>
					</Link>
				</li>
			</ul>

			<div class="flex w-full flex-col gap-4">
				<Textarea readonly placeholder="Описание" value={profile.description} class="resize-none" />
			</div>

			<!-- <Button class="w-full" variant="outline">
				<IconSettings />
				<span>Настройки</span>
			</Button> -->

			{#if !isOwner}
				<FollowButton userId={profile.id} isFollowing={social.isFollowing} />
			{/if}
		</div>

		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<Heading type="h2">Коллекции</Heading>
				<CollectionsGrid
					collections={initialCollections.items}
					cursor={initialCollections.cursor}
					defaultEmptyDescription={isOwner
						? 'У вас пока нет коллекций'
						: 'У этого пользователя пока нет коллекций'}
					disableAutoLoad
					onSearch={searchCollections}
					onLoadMore={loadCollections}
				>
					{#snippet firstCard()}
						{#if isOwner}
							<CreateCollectionCard onCollectionCreated={handleCollectionCreated} />
						{/if}
					{/snippet}
				</CollectionsGrid>
			</div>

			{#if initialFavoriteCollections}
				<div class="flex flex-col gap-4">
					<Heading type="h2">Избранное</Heading>
					<CollectionsGrid
						collections={initialFavoriteCollections.items}
						cursor={initialFavoriteCollections.cursor}
						defaultEmptyDescription="Вы можете добавить коллекции в избранное, чтобы они отображались здесь"
						disableAutoLoad
						onSearch={searchFavoriteCollections}
						onLoadMore={loadFavoriteCollections}
					/>
				</div>
			{/if}
		</div>
	</div></Wrapper
>
