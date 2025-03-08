<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AuthButton } from '$lib/entities/auth';
	import { globalState } from '$lib/state/state.svelte';
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
			url: '/welcome/collections',
			icon: IconList
		},
		{
			title: 'Избранное',
			url: '/welcome/favorites',
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
		<Sidebar.MenuButton size="lg" class="text-lg font-medium">
			<IconLogout2 /> <span>Выйти</span>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Root side="right" variant="sidebar" collapsible="offcanvas">
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
