<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/ui/app-sidebar.svelte';

	import '../fonts.css';

	import '../app.css';
	import { Header, Footer } from '../app/ui';
	let { children } = $props();
</script>

<Sidebar.Provider>
	<div class="flex h-full flex-grow flex-col">
		<Header />
		<AppSidebar />

		<main class="flex-grow">{@render children()}</main>
		<Footer />
	</div>
</Sidebar.Provider>
