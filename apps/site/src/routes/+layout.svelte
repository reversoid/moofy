<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import '../fonts.css';
	import '../app.css';

	import { setCurrentUser } from '$lib/state/state.svelte';
	import { AppSidebar, Footer, Header, UpdatesNotification } from '../app/ui';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<svelte:head>
	<title>Moofy | Welcome</title>
	<meta
		name="description"
		content="Moofy is your ultimate platform for creating and sharing film collections. Join our community to discover, organize and discuss your favorite movies."
	/>

	<meta property="og:title" content="Moofy | Welcome" />
	<meta
		property="og:description"
		content="Moofy is your ultimate platform for creating and sharing film collections. Join our community to discover, organize and discuss your favorite movies."
	/>

	<!-- <meta property="og:image" content="/og-image.png" /> -->

	<meta property="og:url" content="https://moofy.ru" />
	<meta property="og:type" content="website" />
</svelte:head>

<Toaster />

<Sidebar.Provider>
	<div class="flex h-full flex-grow flex-col">
		<Header />
		<AppSidebar />
		<UpdatesNotification />

		<main class="min-h-[calc(100svh-100px-60px)] flex-grow max-sm:min-h-[calc(100svh-100px-96px)]">
			{@render children()}
		</main>
		<Footer />
	</div>
</Sidebar.Provider>
