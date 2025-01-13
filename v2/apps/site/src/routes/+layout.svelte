<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { Header, Footer } from '../app/ui';
	let { children } = $props();
</script>

<div class="flex h-full flex-col">
	<Header />
	<main class="flex-grow">{@render children()}</main>
	<Footer />
</div>
