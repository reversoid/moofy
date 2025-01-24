<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { IconUpload } from '@tabler/icons-svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root
	class="focus-within:border-primary focus-within:ring-primary focus-within:ring-2 focus-within:ring-offset-2"
>
	<Card.Content>
		<div class="grid w-full items-center">
			<Label for="picture">
				<div class="flex h-full w-full flex-col items-center justify-center gap-2">
					<IconUpload size={32} />
					<p class="text-sm">Загрузить изображение</p>
				</div>
			</Label>

			<Input id="picture" class="sr-only" type="file" />
		</div>
	</Card.Content>
</Card.Root>
