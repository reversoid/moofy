<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import '../fonts.css';

	import '../app.css';
	import { Header, Footer, AppSidebar } from '../app/ui';
	import { globalState } from '$lib/state/state.svelte';
	let { children, data } = $props();

	const user = data.user;

	globalState.user = user?.username ?? null;
</script>

<Sidebar.Provider>
	<div class="flex h-full flex-grow flex-col">
		<Header />
		<AppSidebar />

		<main class="min-h-[calc(100svh-100px-60px)] flex-grow max-sm:min-h-[calc(100svh-100px-96px)]">
			{@render children()}
		</main>
		<Footer />
	</div>
</Sidebar.Provider>
