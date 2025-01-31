<script lang="ts">
	import { handleResponse, makeClient } from '$lib/utils';
	import { UsersList } from '$lib/widgets/users-list';
	import type { UserDto } from '@repo/api/dtos';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let users = $state<(UserDto & { isFollowing: boolean })[]>(
		data.users.map((user) => ({ ...user, isFollowing: false }))
	);

	async function searchUsers(search: string) {
		const api = makeClient(fetch);

		const response = await api.users.$get({ query: { search } }).then(handleResponse);

		const { users: newUsers } = response.unwrap();

		users = newUsers.map((user) => ({ ...user, isFollowing: false }));
	}
</script>

<UsersList {users} onSearch={searchUsers} />
