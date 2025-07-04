<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AuthButton } from '$lib/entities/auth';
	import { globalState, setCurrentUser } from '$lib/shared/state';
	import { makeClient } from '$lib/shared/utils';
	import {
		IconBookmark,
		IconList,
		IconLogout2,
		IconSearch,
		IconSettings,
		IconUser
	} from '@tabler/icons-svelte';

	const sidebar = Sidebar.useSidebar();

	const username = $derived(globalState.currentUser?.username);

	const items = $derived([
		{
			title: 'Профиль',
			url: `/profiles/${username}`,
			icon: IconUser
		},
		{
			title: 'Мои коллекции',
			url: '/collections',
			icon: IconList
		},
		{
			title: 'Избранное',
			url: '/favorites',
			icon: IconBookmark
		},
		{
			title: 'Поиск',
			url: '/search/profiles',
			icon: IconSearch
		},
		{
			title: 'Настройки',
			url: '/settings',
			icon: IconSettings
		}
	]);

	const handleItemClick = () => {
		sidebar.toggle();
	};

	const api = makeClient(fetch);

	async function logout() {
		const response = await api.auth.logout.$post();

		if (response.ok) {
			await invalidateAll();
			setCurrentUser(null);
		}
	}
</script>

{#snippet LoginButton()}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton>
			{#snippet child()}
				<AuthButton />
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

{#snippet MenuItems()}
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton size="lg" class="text-lg font-medium" onclick={handleItemClick}>
				{#snippet child({ props })}
					<a href={item.url} {...props}>
						<item.icon size={32} />
						<span>{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
{/snippet}

{#snippet LogoutButton()}
	<Sidebar.MenuItem class="list-none">
		<Sidebar.MenuButton
			onclick={() => {
				logout();
				handleItemClick();
			}}
			size="lg"
			class="text-lg font-medium"
		>
			<IconLogout2 /> <span>Выйти</span>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Root side="right" variant="sidebar" collapsible="offcanvas">
	<!-- https://github.com/huntabyte/bits-ui/issues/427#issuecomment-2025696636 -->
	<input class="fixed left-0 top-0 h-0 w-0" type="checkbox" />

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>{username ?? 'Гость'}</Sidebar.GroupLabel>

			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#if username}
						{@render MenuItems()}
					{:else}
						{@render LoginButton()}
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	{#if username}
		<Sidebar.Footer>
			{@render LogoutButton()}
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>
