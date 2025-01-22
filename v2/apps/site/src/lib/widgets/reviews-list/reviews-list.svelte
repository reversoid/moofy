<script>
	import { Input } from '$lib/components/ui/input';
	import { ReviewCard } from '$lib/entities/review-card';
	import { IconSearch } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Поиск">
		<IconSearch size={20} name="search" slot="prefix" />
	</Input>

	<div class="flex flex-col gap-4">
		<ReviewCard />
		<ReviewCard />
		<ReviewCard />
	</div>
</div>
