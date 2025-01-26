<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { Auth } from '$lib/entities/auth';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { IconMenu } from '@tabler/icons-svelte';

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
			<div class="flex items-center gap-3 max-sm:hidden">
				<Link href="/welcome/collections">Мои коллекции</Link>
				<Link href="/welcome/favorites">Избранное</Link>
				<Link href="/search/profiles">Поиск</Link>
			</div>

			<div class="max-sm:hidden">
				<Auth />
			</div>

			<Button class="sm:hidden" size="icon" variant="outline" onclick={() => sidebar.toggle()}>
				<IconMenu />
			</Button>
		</div>
	</Wrapper>
</header>
