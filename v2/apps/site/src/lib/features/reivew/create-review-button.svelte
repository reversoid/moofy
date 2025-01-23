<script>
	import { Button } from '$lib/components/ui/button';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Button tag="div" class="max-sm:hidden">
	<IconPlus class="mr-2" size="20" />
	<span>Добавить</span>
</Button>

<Button tag="div" size="icon" class="hidden items-center justify-center max-sm:flex">
	<IconPlus />
</Button>
