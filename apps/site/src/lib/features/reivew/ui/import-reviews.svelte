<script>
	import { Button } from '$lib/components/ui/button';
	import { IconTransferIn } from '@tabler/icons-svelte';
</script>

<Button class="max-sm:hidden">
	<IconTransferIn size="20" />
	<span>Импорт</span>
</Button>

<Button size="icon" class="hidden items-center justify-center max-sm:flex">
	<IconTransferIn />
</Button>
