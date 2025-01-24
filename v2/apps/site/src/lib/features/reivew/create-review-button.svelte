<script>
	import { Button } from '$lib/components/ui/button';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Button tag="div" class="max-sm:hidden">
	<IconPlus size="20" />
	<span>Создать</span>
</Button>

<Button tag="div" size="icon" class="hidden items-center justify-center max-sm:flex">
	<IconPlus />
</Button>
