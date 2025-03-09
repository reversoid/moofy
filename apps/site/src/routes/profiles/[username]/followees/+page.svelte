<script lang="ts">
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { handleResponse, makeClient } from '$lib/utils';
	import UsersList from '$lib/widgets/users-list/users-list.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const currentUser = data.user;

	const profile = data.profile;
	const followees = $state(data.followees);

	const isOwner = currentUser?.id === profile.id;

	const api = makeClient(fetch);

	async function searchFollowees(search: string) {
		const result = await api.users[':id'].followees
			.$get({
				param: { id: String(profile.id) },
				query: { limit: String(12), search }
			})
			.then(handleResponse);

		const foundFollowees = result.unwrap().users;

		followees.items = foundFollowees.items;
		followees.cursor = foundFollowees.cursor;
	}

	async function loadMoreFollowees(cursor: string) {
		const result = await api.users[':id'].followees
			.$get({
				param: { id: String(profile.id) },
				query: { limit: String(12), cursor }
			})
			.then(handleResponse);

		const moreFollowees = result.unwrap().users;

		followees.items.push(...moreFollowees.items);
		followees.cursor = moreFollowees.cursor;
	}

	const emptyMessage = $derived(
		`${isOwner ? 'У вас пока нет подписок' : `У пользователя ${profile.username} пока нет подписок`}`
	);
</script>

<Wrapper>
	<Heading>
		Подписки <Link href="/profiles/{profile.username}">{profile.username}</Link>
	</Heading>

	<div class="mt-4">
		<UsersList
			users={followees.items}
			cursor={followees.cursor}
			onLoadMore={loadMoreFollowees}
			onSearch={searchFollowees}
			defaultEmptyDescription={emptyMessage}
		/>
	</div>
</Wrapper>
