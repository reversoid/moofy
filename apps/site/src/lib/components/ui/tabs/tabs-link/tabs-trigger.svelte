<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { href, ariaLabel, children }: { href: string; ariaLabel: string; children: Snippet } =
		$props();

	function pathMatches(path: string) {
		if (path.startsWith('/')) {
			return page.url.pathname === path;
		}
		return page.url.pathname.includes(path);
	}

	let isActive = $derived(pathMatches(href));
</script>

<a
	data-state={isActive ? 'active' : 'notActive'}
	aria-label={ariaLabel}
	{href}
	class="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
>
	{@render children?.()}
</a>
