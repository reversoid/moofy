<script>
	import { Button } from '$lib/components/ui/button';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Button class="max-sm:hidden">
	<IconPlus class="mr-2" size="20" />
	<span>Добавить</span>
</Button>

<Button size="icon" class="flex-center hidden items-center max-sm:flex">
	<IconPlus />
</Button>
