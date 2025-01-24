<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<a aria-label={`Profile username`} href="/profiles/username">
	<Card.Root class="flex flex-col gap-4">
		<div class="flex flex-row justify-between">
			<Card.Header>
				<Card.Title>John Doe</Card.Title>
				<Card.Description>Нет описания</Card.Description>
			</Card.Header>

			<Card.Content class="shrink-0">
				<img class="size-20 rounded-full" src="https://picsum.photos/300/300" alt="User" />
			</Card.Content>
		</div>

		<Card.Footer>
			<Button onclick={(e) => e.preventDefault()} class="w-full">Follow</Button>
		</Card.Footer>
	</Card.Root>
</a>
