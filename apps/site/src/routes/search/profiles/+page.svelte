<script lang="ts">
	import { handleResponse, makeClient } from '$lib/utils';
	import { UsersList } from '$lib/widgets/users-list';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let users = $state(data.users);

	async function searchUsers(search: string) {
		const api = makeClient(fetch);

		const response = await api.users.$get({ query: { search } }).then(handleResponse);

		const { users: newUsers } = response.unwrap();

		users = newUsers;
	}
</script>

<UsersList {users} onSearch={searchUsers} defaultEmptyDescription="Нет пользователей..." />
