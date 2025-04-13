<script lang="ts">
	import { makeClient } from '$lib/shared/utils';
	import { UsersList } from '$lib/widgets/users-list';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let users = $state(data.users);

	async function searchUsers(search: string) {
		const api = makeClient(fetch);

		const response = await api.users.$get({ query: { search } });

		if (!response.ok) {
			return;
		}

		const { users: newUsers } = await response.json();

		users = newUsers;
	}
</script>

<UsersList {users} onSearch={searchUsers} defaultEmptyDescription="Пользователей не найдено" />
