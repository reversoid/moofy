<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PasskeyDto } from '@repo/api/dtos';
	import { dayjs } from '@repo/core/sdk';
	import { IconKey, IconPencil, IconTrash } from '@tabler/icons-svelte';

	type Props = {
		passkey?: PasskeyDto;
	};

	const { passkey = { nickname: 'New Passkey', createdAt: new Date().toISOString() } }: Props =
		$props();
</script>

<!-- TODO open dialog -->
<div class="flex items-center justify-between gap-4 px-4 py-3">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<IconKey size={20} />

			<span>{passkey.nickname}</span>
		</div>

		<span class="text-muted-foreground text-sm"
			>Создано {dayjs(passkey.createdAt).format('DD/MM/YYYY')}</span
		>
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
