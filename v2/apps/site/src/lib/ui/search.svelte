<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { IconSearch } from '@tabler/icons-svelte';
	import debounce from 'lodash.debounce';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		onSearch?: (search: string) => Promise<void>;
	}

	let { onSearch }: Props = $props();

	let isSearching = $state(false);

	const handleInput = debounce(async (e: Parameters<FormEventHandler<HTMLInputElement>>[0]) => {
		isSearching = true;
		await onSearch?.((e.target as HTMLInputElement).value);
		isSearching = false;
	}, 300);
</script>

<Input oninput={handleInput} placeholder="Поиск" isLoading={isSearching}>
	{#snippet inputPrefix()}
		<IconSearch size={20} />
	{/snippet}
</Input>
