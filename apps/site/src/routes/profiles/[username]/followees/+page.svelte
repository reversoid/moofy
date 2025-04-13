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
	const followees = $state(data.followees);

	const isOwner = currentUser?.id === profile.id;

	const api = makeClient(fetch);

	async function searchFollowees(search: string) {
		const result = await api.users[':id'].followees.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12), search }
		});

		if (!result.ok) {
			return;
		}

		const { users: foundFollowees } = await result.json();

		followees.items = foundFollowees.items;
		followees.cursor = foundFollowees.cursor;
	}

	async function loadMoreFollowees(cursor: string) {
		const result = await api.users[':id'].followees.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12), cursor }
		});

		if (!result.ok) {
			return;
		}

		const { users: moreFollowees } = await result.json();

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
