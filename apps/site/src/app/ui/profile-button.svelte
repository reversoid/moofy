<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { setCurrentUser } from '$lib/state/state.svelte';
	import { makeClient } from '$lib/utils';
	import { IconLogout2, IconSettings, IconUser } from '@tabler/icons-svelte';

	interface Props {
		src: string | null;
		username: string;
	}

	let { src, username = '' }: Props = $props();

	const api = makeClient(fetch);

	async function logout() {
		const response = await api.auth.logout.$post();

		if (response.ok) {
			goto('/');
			setCurrentUser(null);
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			<Avatar.Image {src} alt="Profile" />
			<Avatar.Fallback>
				<IconUser size={16} />
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>{username}</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Item class="p-0">
					<a class="flex w-full items-center gap-2 px-2 py-1.5" href="/profiles/{username}">
						<IconUser />
						<span>Профиль</span>
					</a>
				</DropdownMenu.Item>

				<!-- TODO make dropdown menu link item to remove px-0, px-2 things -->
				<DropdownMenu.Item class="p-0">
					<a class="flex w-full items-center gap-2 px-2 py-1.5" href="/settings">
						<IconSettings />
						<span>Настройки</span>
					</a>
				</DropdownMenu.Item>

				<DropdownMenu.Item class="cursor-pointer" onclick={logout}>
					<IconLogout2 />
					<span>Выйти</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
