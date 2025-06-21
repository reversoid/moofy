<script>
	import { Button } from '$lib/components/ui/button';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Button size="icon" tag="div" class="flex sm:hidden">
	<IconPlus />
</Button>

<Button tag="div" class="hidden sm:flex">
	<IconPlus />
	<span>Создать</span>
</Button>
