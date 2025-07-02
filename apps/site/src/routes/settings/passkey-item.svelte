<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconCheck, IconKey, IconPencil, IconTrash } from '@tabler/icons-svelte';
	import { tick } from 'svelte';

	type Props = {};
</script>

<!-- TODO open dialog -->
<div class="flex items-center justify-between gap-4 px-4 py-3">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<IconKey size={20} />

			<span>Passkey 2</span>
		</div>
		<span class="text-muted-foreground text-sm">Создано 10.11.2025</span>
	</div>

	<div>
		<Button size="icon" variant="outline">
			<IconPencil />
		</Button>

		<Button size="icon" variant="destructive">
			<IconTrash />
		</Button>
	</div>
</div>
