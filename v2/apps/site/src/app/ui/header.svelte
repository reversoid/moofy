<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Avatar } from '$lib/components/ui/avatar';
	import Wrapper from '$lib/ui/wrapper.svelte';
</script>

<header class="flex items-center justify-center pb-5 pt-3 backdrop-blur-md">
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
