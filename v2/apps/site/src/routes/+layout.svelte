<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { Header, Footer } from '../app/ui';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="flex h-full flex-col">
	<Header />
	<main class="flex-grow">{@render children()}</main>
	<Footer />
</div>
