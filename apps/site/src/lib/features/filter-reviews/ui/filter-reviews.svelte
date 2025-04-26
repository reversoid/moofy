<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { IconFilter } from '@tabler/icons-svelte';
</script>

<!-- TODO -->

<Dialog.Root>
	<Dialog.Trigger>
		<Button size="icon" variant="outline">
			<IconFilter />
		</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Фильтр обзоров</Dialog.Title>
			<Dialog.Description>Здесь Вы можете настроить фильтрацию для обзоров</Dialog.Description>
		</Dialog.Header>

		<div class="mt-4 flex flex-col gap-2">
			<Input placeholder="Год" />
			<Input placeholder="Длительность" />

			<Select.Root type="single">
				<Select.Trigger>Тип</Select.Trigger>
				<Select.Content>
					<Select.Item value="zipzipzip">Item</Select.Item>
					<Select.Item value="zipzipzip2">Item3</Select.Item>
					<Select.Item value="zipzipzip3">Item4</Select.Item>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single">
				<Select.Trigger>Жанры</Select.Trigger>
				<Select.Content>
					<Select.Item value="zipzipzip">Item</Select.Item>
					<Select.Item value="zipzipzip2">Item3</Select.Item>
					<Select.Item value="zipzipzip3">Item4</Select.Item>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single">
				<Select.Trigger>Теги</Select.Trigger>
				<Select.Content>
					<Select.Item value="zipzipzip">Item</Select.Item>
					<Select.Item value="zipzipzip2">Item3</Select.Item>
					<Select.Item value="zipzipzip3">Item4</Select.Item>
				</Select.Content>
			</Select.Root>

			<Input placeholder="Дата создания" />
			<Input placeholder="Дата обновления" />
		</div>
	</Dialog.Content>
</Dialog.Root>
