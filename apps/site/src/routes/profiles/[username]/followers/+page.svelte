<script lang="ts">
	import Heading from '$lib/shared/ui/heading.svelte';
	import Link from '$lib/shared/ui/link.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import { makeClient } from '$lib/shared/utils';
	import UsersList from '$lib/widgets/users-list/users-list.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const currentUser = data.user;

	const profile = data.profile;
	const followers = $state(data.followers);

	const isOwner = currentUser?.id === profile.id;

	const api = makeClient(fetch);

	async function searchFollowers(search: string) {
		const result = await api.users[':id'].followers.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12), search }
		});

		if (!result.ok) {
			return;
		}

		const { users: foundFollowers } = await result.json();

		followers.items = foundFollowers.items;
		followers.cursor = foundFollowers.cursor;
	}

	async function loadMoreFollowers(cursor: string) {
		const result = await api.users[':id'].followers.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12), cursor }
		});

		if (!result.ok) {
			return;
		}

		const { users: moreFollowers } = await result.json();

		followers.items.push(...moreFollowers.items);
		followers.cursor = moreFollowers.cursor;
	}

	const emptyMessage = $derived(
		`${isOwner ? 'У вас пока нет подписчиков' : `У пользователя ${profile.username} пока нет подписчиков`}`
	);
</script>

<Wrapper>
	<Heading
		>Подписчики
		<Link href="/profiles/{profile.username}">{profile.username}</Link>
	</Heading>

	<div class="mt-4">
		<UsersList
			users={followers.items}
			cursor={followers.cursor}
			onLoadMore={loadMoreFollowers}
			onSearch={searchFollowers}
			defaultEmptyDescription={emptyMessage}
		/>
	</div>
</Wrapper>
