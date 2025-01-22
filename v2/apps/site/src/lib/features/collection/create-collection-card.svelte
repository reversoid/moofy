<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Card.Root class="flex flex-col items-center justify-center">
	<Card.Header>
		<Card.Title>Новая коллекция</Card.Title>
	</Card.Header>
	<Card.Content>
		<Button>
			<IconPlus class="mr-1" />
			Создать
		</Button>
	</Card.Content>
</Card.Root>
