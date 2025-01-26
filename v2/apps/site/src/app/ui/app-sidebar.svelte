<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AuthModal } from '$lib/entities/auth';
	import {
		IconBookmark,
		IconList,
		IconLogin2,
		IconLogout2,
		IconSearch,
		IconSettings,
		IconUser
	} from '@tabler/icons-svelte';

	const sidebar = Sidebar.useSidebar();

	const items = [
		{
			title: 'Профиль',
			url: '/profiles/1',
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
	];

	const handleItemClick = () => {
		sidebar.toggle();
	};

	const isLoggedIn = true;
</script>

{#snippet LoginButton()}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton>
			{#snippet child({ props })}
				<AuthModal>
					{#snippet trigger()}
						<div {...props}>
							<IconLogin2 />
							<span>Войти</span>
						</div>
					{/snippet}
				</AuthModal>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

{#snippet MenuItems()}
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton onclick={handleItemClick}>
				{#snippet child({ props })}
					<a href={item.url} {...props}>
						<item.icon />
						<span>{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
{/snippet}

{#snippet LogoutButton()}
	<Sidebar.MenuItem class="list-none">
		<Sidebar.MenuButton>
			<IconLogout2 /> <span>Выйти</span>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Root side="right" variant="sidebar" collapsible="offcanvas">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>reversoid</Sidebar.GroupLabel>

			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#if isLoggedIn}
						{@render MenuItems()}
					{:else}
						{@render LoginButton()}
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	{#if isLoggedIn}
		<Sidebar.Footer>
			{@render LogoutButton()}
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>
