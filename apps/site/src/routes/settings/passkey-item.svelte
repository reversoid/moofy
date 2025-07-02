<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DeleteButton from '$lib/shared/ui/delete-button.svelte';
	import { makeClient } from '$lib/shared/utils';
	import type { PasskeyDto } from '@repo/api/dtos';
	import { dayjs } from '@repo/core/sdk';
	import { IconKey, IconPencil } from '@tabler/icons-svelte';

	type Props = {
		passkey: PasskeyDto;
		onDeleted: () => void;
	};

	let { passkey = $bindable(), onDeleted }: Props = $props();

	let isDeleting = $state(false);

	async function editName(newNickname: string) {
		const client = makeClient(fetch);

		const response = await client.auth.passkeys[':id'].$patch({
			json: { nickname: newNickname },
			param: { id: passkey.id }
		});

		if (!response.ok) {
			return;
		}

		const { passkey: newPasskey } = await response.json();

		passkey.nickname = newPasskey.nickname;
	}

	async function remove() {
		isDeleting = true;
		const client = makeClient(fetch);

		const response = await client.auth.passkeys[':id'].$delete({
			param: { id: passkey.id }
		});

		isDeleting = false;

		if (!response.ok) {
			return;
		}

		onDeleted();
	}
</script>

<!-- TODO open dialog -->
<div class="flex flex-col items-start justify-between gap-4 px-4 py-3 sm:flex-row sm:items-center">
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
		<Button type="button" size="icon" variant="outline">
			<IconPencil />
		</Button>

		<DeleteButton isLoading={isDeleting} size="icon" onDelete={remove} />
	</div>
</div>
