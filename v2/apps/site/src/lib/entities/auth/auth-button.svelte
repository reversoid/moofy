<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconLogin2 } from '@tabler/icons-svelte';
</script>

<Button tag="div" class="max-sm:hidden">
	<IconLogin2 size="20" class="mr-2" />
	<span>Войти</span>
</Button>

<Button tag="div" size="icon" class="flex-center hidden items-center max-sm:flex">
	<IconLogin2 />
</Button>
