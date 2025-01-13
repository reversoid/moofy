<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import Wrapper from '$lib/ui/wrapper.svelte';
</script>

<header class="flex h-20 items-center justify-center backdrop-blur-md">
	<Wrapper class="flex items-center justify-between">
		<div>
			<img src="/logo.svg" width="128" height="64" alt="Moofy Logo" />
		</div>

		<div>
			<Button>Войти</Button>
			<!-- <Avatar>GK</Avatar> -->
		</div>
	</Wrapper>
</header>
