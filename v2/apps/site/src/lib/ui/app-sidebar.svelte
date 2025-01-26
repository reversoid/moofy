<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { IconBookmark, IconList, IconLogout2, IconSearch, IconUser } from '@tabler/icons-svelte';

	const sidebar = Sidebar.useSidebar();

	const items = [
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
		}
	];

	const handleItemClick = () => {
		sidebar.toggle();
	};
</script>

<Sidebar.Root side="right" variant="sidebar" collapsible="offcanvas">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Moofy</Sidebar.GroupLabel>

			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton onclick={handleItemClick}>
							{#snippet child({ props })}
								<a href="/profiles/1" {...props}>
									<IconUser />
									<span><b>reversoid</b></span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>

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
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.MenuButton>
			<IconLogout2 /> <span>Выйти</span>
		</Sidebar.MenuButton>
	</Sidebar.Footer>
</Sidebar.Root>
