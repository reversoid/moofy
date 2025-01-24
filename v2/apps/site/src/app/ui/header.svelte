<script lang="ts">
	import { Auth } from '$lib/entities/auth';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
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

			<Auth />
		</div>
	</Wrapper>
</header>
