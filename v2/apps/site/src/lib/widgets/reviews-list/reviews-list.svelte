<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ReviewCard } from '$lib/entities/review-card';
	import { IconSearch } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Поиск">
		<IconSearch size={20} name="search" slot="prefix" />
	</Input>

	<div class="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>

		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
		<ReviewCard>
			<Button slot="actions" variant="outline">Изменить</Button>
		</ReviewCard>
	</div>
</div>
