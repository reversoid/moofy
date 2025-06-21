<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { PrivateTooltip } from '$lib/entities/collection';
	import Tag from '$lib/entities/Tag/tag.svelte';
	import { BookmarkCollection, EditCollection, LikeCollection } from '$lib/features/collection';
	import MoveUpCollection from '$lib/features/collection/move-up-collection.svelte';
	import { CreateReview, ImportReviews } from '$lib/features/reivew';
	import { globalState } from '$lib/shared/state';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Link from '$lib/shared/ui/link.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import { makeClient } from '$lib/shared/utils';
	import { ReviewsList } from '$lib/widgets/reviews-list';
	import type { CollectionDto, ReviewDto } from '@repo/api/dtos';
	import { dayjs } from '@repo/core/sdk';
	import { IconDeviceTv, IconUser } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import type { ReviewFilters } from '$lib/features/filter-reviews';
	import { CollectionNameBuilder } from '$lib/shared/utils/collection-name-builder';
	import CollectionName from '$lib/shared/utils/collection-name.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { PaginatedData } from '$lib/shared/utils/types';

	function getWatchedIds(flags: boolean[], reviews: ReviewDto[]): SvelteSet<ReviewDto['id']> {
		if (flags.length !== reviews.length) {
			return new SvelteSet<ReviewDto['id']>();
		}

		return new SvelteSet<ReviewDto['id']>(
			reviews.filter((_, index) => flags[index]).map((r) => r.id)
		);
	}

	const { data }: PageProps = $props();

	let collection = $state(data.collection);
	let reviews = $state(data.reviews);
	let socials = $state(data.socials);
	let tags = $state(data.tags);
	let watchedIds = $state(data.watched && getWatchedIds(data.watched, data.reviews.items));

	const isOwner = $derived(collection.creator.id === data.user?.id);

	const formattedUpdatedAt = $derived(dayjs(collection.updatedAt).format('DD.MM.YYYY'));

	// TODO maybe loadMoreLogic should be in the widget?
	// loadMoreReview will just return promise with new data,
	// and we will update the state in the widget
	async function loadMoreReviews(cursor?: string) {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].reviews.$get({
			param: { collectionId: String(data.collection.id) },
			query: { cursor, limit: '20' }
		});

		if (!response.ok) {
			return;
		}

		const { reviews: newReviews, watched } = await response.json();
		reviews.items = [...reviews.items, ...newReviews.items];
		reviews.cursor = newReviews.cursor;

		for (const watchedId of getWatchedIds(watched!, newReviews.items)) {
			watchedIds?.add(watchedId);
		}
	}

	function handleReviewCreated(review: ReviewDto) {
		reviews.items = [review, ...reviews.items];
	}

	function handleCollectionUpdated(updatedCollection: CollectionDto) {
		collection = updatedCollection;
	}

	function handleCollectionDeleted() {
		goto('/collections');
	}

	async function filterReviews({
		filters,
		search
	}: {
		filters: ReviewFilters | null;
		search: string;
	}) {
		const api = makeClient(fetch);

		const response = await api.collections[':collectionId'].reviews.$get({
			param: { collectionId: collection.id.toString() },
			query: {
				genre: filters?.genres,
				createdAt: filters?.createdAt,
				updatedAt: filters?.updatedAt,
				tagId: filters?.tagIds?.map(String),
				type: filters?.types,
				year: filters?.years,
				score: filters?.score,
				search: search
			}
		});

		if (!response.ok) {
			return;
		}

		const { reviews: filteredReviews } = await response.json();

		reviews = filteredReviews;
	}

	const currentUser = globalState.currentUser;

	onMount(() => {
		const api = makeClient(fetch);
		void api.collections[':collectionId'].views.$post({
			param: { collectionId: String(collection.id) }
		});
	});

	function handleImportedReviews(newReviews: ReviewDto[]) {
		reviews.items.unshift(
			...newReviews.toSorted(
				(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			)
		);

		if (collection.type === 'watch') {
			for (const reviewWithScore of newReviews.filter((r) => r.score)) {
				watchedIds?.add(reviewWithScore.id);
			}
		}
	}
</script>

<svelte:head>
	<title>{new CollectionNameBuilder(collection).toString()} | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>
		<CollectionName
			{collection}
			wrapperComponent={Link}
			wrapperProps={{ href: `/profiles/${collection.creator.username}` }}
		/>
	</Heading>

	<div
		class="mt-6 grid grid-cols-[4fr_1fr] gap-2 max-xl:grid-cols-[3fr_1fr] max-lg:grid-cols-[2fr_1fr] max-md:grid-cols-1"
	>
		<Card.Root>
			<Card.Header>
				<Card.Title>Описание</Card.Title>
			</Card.Header>

			<Card.Content class="flex grow flex-col justify-between gap-4">
				{#if collection.description}
					<p>{collection.description.trim()}</p>
				{:else}
					<p class="text-muted-foreground">Описание отсутствует</p>
				{/if}

				<div class="flex items-center gap-4">
					<div class="flex flex-row flex-wrap gap-2 overflow-auto">
						{#each tags as tag}
							<Tag {tag} />
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>О коллекции</Card.Title>
					{#if !collection.isPublic}
						<PrivateTooltip />
					{/if}
				</div>
			</Card.Header>

			<Card.Content>
				<ul class="flex flex-col gap-1">
					<li>
						Создатель: <Link href="/profiles/{collection.creator.username}"
							>{collection.creator.username}</Link
						>
					</li>
					<li>Обновлено: {formattedUpdatedAt}</li>
				</ul>

				<div class="mt-3 flex flex-col gap-2">
					<div class="flex gap-2">
						<LikeCollection
							disabled={!currentUser}
							likesAmount={socials.likesAmount}
							isLiked={socials.isLiked}
							collectionId={collection.id}
						/>

						<BookmarkCollection
							disabled={!currentUser}
							isBookmarked={socials.isFavorited}
							collectionId={collection.id}
						/>
					</div>

					{#if isOwner}
						<div class="flex gap-2">
							<EditCollection
								bind:tags
								{collection}
								onCollectionUpdated={handleCollectionUpdated}
								onCollectionDeleted={handleCollectionDeleted}
							/>

							<MoveUpCollection collectionId={collection.id} />
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	{#if collection.type === 'personal'}
		<Alert.Root class="mt-2">
			<IconUser size={20} />
			<Alert.Title>О коллекции</Alert.Title>
			<Alert.Description>
				Это <b>персональная коллекция</b>.
				{#if isOwner}
					Здесь Вы можете хранить все свои обзоры.

					<br />

					{#if collection.isPublic}
						Данная коллекция отображается в профиле.
					{:else}
						Чтобы коллекция была видна в профиле, необходимо сделать ее публичной.
					{/if}
				{:else}
					<!-- TODO maybe make link builder? -->
					Здесь <Link href="/profiles/{collection.creator.username}"
						>{collection.creator.username}</Link
					> хранит свои обзоры
				{/if}
			</Alert.Description>
		</Alert.Root>
	{/if}

	{#if collection.type === 'watch'}
		<Alert.Root class="mt-2">
			<IconDeviceTv size={20} />
			<Alert.Title>О коллекции</Alert.Title>
			<Alert.Description>
				Это <b>watch коллекция</b>.
				{#if isOwner}
					Здесь Вы можете отслеживать свои просмотренные фильмы и сериалы.

					<br />

					{#if collection.isPublic}
						Данная коллекция отображается в профиле.
					{:else}
						Чтобы коллекция была видна в профиле, необходимо сделать ее публичной.
					{/if}
				{:else}
					<!-- TODO maybe make link builder? -->
					Здесь <Link href="/profiles/{collection.creator.username}"
						>{collection.creator.username}</Link
					> отслеживает просмотренные фильмы и сериалы.
				{/if}
			</Alert.Description>
		</Alert.Root>
	{/if}

	<div class="mt-6 flex items-center justify-between gap-4">
		<Heading type="h2">Обзоры</Heading>

		{#if isOwner}
			<div class="flex gap-2">
				{#if collection.type === 'personal' || collection.type === 'watch'}
					<ImportReviews type={collection.type} {tags} onAddedReviews={handleImportedReviews} />
				{/if}

				<CreateReview collectionId={collection.id} onReviewCreated={handleReviewCreated} />
			</div>
		{/if}
	</div>

	<div class="mt-4">
		<ReviewsList
			{collection}
			{tags}
			bind:reviews={reviews.items}
			canEdit={isOwner}
			cursor={reviews.cursor}
			onFilters={filterReviews}
			onLoadMore={loadMoreReviews}
			defaultEmptyDescription={isOwner
				? 'Вы можете добавить обзор в эту коллекцию'
				: 'Эта коллекция пуста'}
			{watchedIds}
		/>
	</div>
</Wrapper>
