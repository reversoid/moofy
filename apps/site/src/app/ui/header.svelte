<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { AuthButton } from '$lib/entities/auth';
	import Link from '$lib/shared/ui/link.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import { IconMenu } from '@tabler/icons-svelte';
	import ProfileButton from './profile-button.svelte';
	import { globalState } from '$lib/shared/state';

	const sidebar = useSidebar();
</script>

<header class="flex items-center justify-center pb-7 pt-3 backdrop-blur-md">
	<Wrapper class="flex items-center justify-between">
		<div>
			<Link href="/">
				<img src="/logo.svg" width="128" height="64" alt="Moofy Logo" />
			</Link>
		</div>

		<div class="flex items-center gap-5">
			{#if globalState.currentUser}
				<div class="flex items-center gap-3 max-sm:hidden">
					<Link href="/collections">Мои коллекции</Link>
					<Link href="/favorites">Избранное</Link>
					<Link href="/search/profiles">Поиск</Link>
				</div>

				<div class="flex items-center justify-center max-sm:hidden">
					<ProfileButton
						src={globalState.currentUser.imageUrl}
						username={globalState.currentUser.username}
					/>
				</div>
			{/if}

			{#if globalState.currentUser}
				<Button class="sm:hidden" size="icon" variant="outline" onclick={() => sidebar.toggle()}>
					<IconMenu />
				</Button>
			{:else}
				<div>
					<AuthButton />
				</div>
			{/if}
		</div>
	</Wrapper>
</header>
