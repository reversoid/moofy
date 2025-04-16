<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Link from '$lib/shared/ui/link.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import { IconSettings, IconUser } from '@tabler/icons-svelte';
	import type { PageProps } from './$types';
	import { makeClient } from '$lib/shared/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import CreateCollectionCard from '$lib/features/collection/create-collection-card.svelte';
	import { FollowButton } from '$lib/features/profile';
	import { Button } from '$lib/components/ui/button';
	import Image from '$lib/shared/ui/image.svelte';

	const { data }: PageProps = $props();

	const profile = $derived(data.profile);
	const currentUser = $derived(data.user);
	const social = $derived(data.social);

	let collections = $state(data.collections);

	let favoriteCollections = $state(data.favoriteCollections);

	let specialCollectionsSearch = $state('');

	// TODO can the name be better? Is it possible to make a shared name builder for personalCollection?
	const specialCollections = $derived(
		(data.personalCollection
			? [{ ...data.personalCollection, name: `Обзоры ${data.personalCollection.creator.username}` }]
			: []
		)
			.filter((v) => !!v)
			.filter(
				(c) =>
					c.description
						?.toLocaleLowerCase()
						?.includes(specialCollectionsSearch.toLocaleLowerCase()) ||
					c.name.toLocaleLowerCase().includes(specialCollectionsSearch.toLocaleLowerCase())
			)
	);

	async function searchCollections(search: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.users[':id'].collections.$get({
			param: { id: String(profile.id) },
			query: { search }
		});

		if (collectionsResult.ok) {
			const { collections: newCollections } = await collectionsResult.json();
			collections = newCollections;
		}
	}

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.users[':id'].collections.$get({
			param: { id: String(profile.id) },
			query: { cursor, limit: '8' }
		});

		if (collectionsResult.ok) {
			const { collections: newCollections } = await collectionsResult.json();

			collections = {
				items: [...collections.items, ...newCollections.items],
				cursor: newCollections.cursor
			};
		}
	}

	async function handleCollectionCreated(collection: CollectionDto) {
		collections.items.unshift(collection);
	}

	async function searchFavoriteCollections(search: string) {
		const api = makeClient(fetch);

		const collectionsResult = await api.favorites.$get({
			query: { search }
		});

		if (collectionsResult.ok) {
			const { collections: newCollections } = await collectionsResult.json();
			favoriteCollections = newCollections;
		}
	}

	async function loadFavoriteCollections(cursor?: string) {
		if (!favoriteCollections) return;

		const api = makeClient(fetch);

		const collectionsResult = await api.favorites.$get({ query: { cursor, limit: '8' } });

		if (collectionsResult.ok) {
			const { collections: newCollections } = await collectionsResult.json();

			favoriteCollections = {
				items: [...favoriteCollections.items, ...newCollections.items],
				cursor: newCollections.cursor
			};
		}
	}

	const isOwner = $derived(profile.id === currentUser?.id);
</script>

<Wrapper>
	<div
		class="grid grid-cols-[1fr_5fr] gap-12 max-xl:grid-cols-[1fr_4fr] max-xl:gap-10 max-lg:grid-cols-[1fr_3fr] max-md:grid-cols-1"
	>
		<div class="flex flex-col gap-5 max-md:items-center">
			{#if profile.imageUrl}
				<Image
					src={profile.imageUrl}
					alt="Profile avatar"
					class="bg-muted flex aspect-square w-full items-center justify-center rounded-full object-cover text-center max-md:size-36"
				/>
			{:else}
				<div
					class="bg-muted flex aspect-square w-full items-center justify-center rounded-full max-md:size-36"
				>
					<IconUser size={48} />
				</div>
			{/if}

			<h1 class="text-center text-2xl font-medium">{profile.username}</h1>

			<ul class="flex flex-col justify-between gap-1 text-sm">
				<li class="text-center">
					<Link href="/profiles/{profile.username}/followers">
						<span>Подписчики</span>
						<span>{social.followersAmount}</span>
					</Link>
				</li>

				<li class="text-center">
					<Link href="/profiles/{profile.username}/followees">
						<span>Подписки</span>
						<span>{social.followeesAmount}</span>
					</Link>
				</li>
			</ul>

			<div class="flex w-full flex-col gap-4">
				<Textarea readonly placeholder="Описание" value={profile.description} />
			</div>

			{#if isOwner}
				<Button href="/settings" class="w-full" variant="outline">
					<IconSettings />
					<span>Настройки</span>
				</Button>
			{:else if currentUser}
				<FollowButton userId={profile.id} isFollowing={social.isFollowing} />
			{/if}
		</div>

		<div class="flex flex-col gap-8">
			{#if data.personalCollection}
				<div class="flex flex-col gap-4">
					<Heading type="h2">Особые коллекции</Heading>
					<CollectionsGrid
						onSearch={async (v) => {
							specialCollectionsSearch = v;
						}}
						collections={specialCollections}
						defaultEmptyDescription=""
					/>
				</div>
			{/if}

			<div class="flex flex-col gap-4">
				<Heading type="h2">Коллекции</Heading>
				<CollectionsGrid
					collections={collections.items}
					cursor={collections.cursor}
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

			{#if favoriteCollections}
				<div class="flex flex-col gap-4">
					<Heading type="h2">Избранное</Heading>
					<CollectionsGrid
						collections={favoriteCollections.items}
						cursor={favoriteCollections.cursor}
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
