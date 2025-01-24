<script>
	import { Input } from '$lib/components/ui/input';
	import { UserCard } from '$lib/entities/user-card';
	import { IconSearch } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Поиск">
		{#snippet inputPrefix()}
			<IconSearch size={20} />
		{/snippet}
	</Input>

	<div class="grid grid-cols-4 gap-4">
		<UserCard />
		<UserCard />
		<UserCard />
		<UserCard />
		<UserCard />
	</div>
</div>
