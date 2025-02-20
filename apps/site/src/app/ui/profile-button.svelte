<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { setCurrentUser } from '$lib/state/state.svelte';
	import { handleResponse, makeClient } from '$lib/utils';
	import { IconLogout2, IconSettings, IconUser } from '@tabler/icons-svelte';

	interface Props {
		src: string | null;
		username: string;
	}

	let { src, username = '' }: Props = $props();

	const api = makeClient(fetch);

	async function logout() {
		const response = await api.auth.logout.$post().then(handleResponse);

		if (response.isOk()) {
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
				<DropdownMenu.Item>
					<a class="flex w-full items-center gap-2" href="/profiles/{username}">
						<IconUser />
						<span>Профиль</span>
					</a>
				</DropdownMenu.Item>

				<DropdownMenu.Item>
					<a class="flex w-full items-center gap-2" href="/settings">
						<IconSettings />
						<span>Настройки</span>
					</a>
				</DropdownMenu.Item>

				<DropdownMenu.Item onclick={logout}>
					<IconLogout2 />
					<span>Выйти</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
