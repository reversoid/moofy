<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconLogin2 } from '@tabler/icons-svelte';
</script>

<Button href="/auth/login" class="max-sm:hidden">
	<IconLogin2 size="20" />
	<span>Войти</span>
</Button>

<Button href="/auth/login" size="icon" class="flex-center hidden items-center max-sm:flex">
	<IconLogin2 />
</Button>
