<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import Link from '$lib/ui/link.svelte';
	import { IconLogin, IconLogin2 } from '@tabler/icons-svelte';
	import { AuthButton } from '$lib/entities/auth-button';
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
				<Link href="/search">Поиск</Link>
			</div>

			<AuthButton />
		</div>
	</Wrapper>
</header>
