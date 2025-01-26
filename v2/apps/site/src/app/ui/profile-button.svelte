<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { IconLogout2, IconSettings, IconUser } from '@tabler/icons-svelte';

	interface Props {
		src: string;
		username: string;
	}

	let { src, username }: Props = $props();

	function logout() {
		console.log('logout');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			<Avatar.Image src={src || 'https://github.com/shadcn.png'} alt="@shadcn" />
			<Avatar.Fallback>{username.slice(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>reversoid</DropdownMenu.GroupHeading>
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
