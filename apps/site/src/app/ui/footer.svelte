<script>
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
</script>

<footer class="flex items-center justify-center">
	<Wrapper class="flex items-center justify-between gap-3 py-4 pt-5 max-sm:flex-col">
		<div>
			Создатель: <Link isExternal target="_blank" href="https://github.com/reversoid"
				>reversoid</Link
			>
		</div>

		<div class="flex items-center justify-center gap-2">
			<Link target="_blank" href="https://github.com/reversoid/moofy">Github</Link>
			<Link href="/support">Поддержка</Link>
			<Link href="/roadmap">Roadmap</Link>
		</div>
	</Wrapper>
</footer>
