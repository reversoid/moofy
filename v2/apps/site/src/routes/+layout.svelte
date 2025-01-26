<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import '../fonts.css';

	import '../app.css';
	import { Header, Footer, AppSidebar } from '../app/ui';
	let { children, data } = $props();
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
