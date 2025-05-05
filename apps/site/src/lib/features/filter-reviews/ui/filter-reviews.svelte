<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { IconFilter, IconFilterFilled, IconSearch } from '@tabler/icons-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const schema = z.object({
		year: z.string().optional(),
		duration: z.string().optional(),
		createdAt: z.string(),
		updatedAt: z.string(),

		type: z.array(z.string()),
		genres: z.array(z.string()),
		tags: z.array(z.number())
	});

	const form = superForm(defaults({}, zod(schema)), {
		SPA: true,
		validators: zod(schema),
		onUpdate(event) {
			console.log(event.form.data);
		},
		resetForm: false
	});

	const { enhance, form: formData, formId } = form;

	let areFiltersApplied = $state(true);
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button size="icon" variant="outline">
			{#if areFiltersApplied}
				<IconFilterFilled />
			{:else}
				<IconFilter />
			{/if}
		</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Фильтр обзоров</Dialog.Title>
			<Dialog.Description class="mt-4">
				Для текстовых полей вы можете использовать следующие форматы:
				<br /> <b>A</b> для указания точного значения
				<br /> <b>A-B</b> для указания диапазона
				<br /> <b>A-B, C, D</b> для указания перечисления
			</Dialog.Description>
		</Dialog.Header>

		<form id={$formId} use:enhance class="mt-2 flex flex-col gap-2">
			<Form.Field {form} name="year">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Год</Form.Label>
						<Input bind:value={$formData.year} placeholder="2024" {...attrs} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="duration">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Длительность, мин.</Form.Label>
						<Input bind:value={$formData.duration} placeholder="90" {...attrs} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Тип</Form.Label>
						<Select.Root type="single">
							<Select.Trigger>Фильм</Select.Trigger>
							<Select.Content>
								<Select.Item value="zipzipzip">Item</Select.Item>
								<Select.Item value="zipzipzip2">Item3</Select.Item>
								<Select.Item value="zipzipzip3">Item4</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="genres">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Жанры</Form.Label>
						<Select.Root type="single">
							<Select.Trigger>Комедия</Select.Trigger>
							<Select.Content>
								<Select.Item value="zipzipzip">Item</Select.Item>
								<Select.Item value="zipzipzip2">Item3</Select.Item>
								<Select.Item value="zipzipzip3">Item4</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="tags">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Теги</Form.Label>
						<Select.Root type="single">
							<Select.Trigger>Выбранные теги</Select.Trigger>
							<Select.Content>
								<Select.Item value="zipzipzip">Item</Select.Item>
								<Select.Item value="zipzipzip2">Item3</Select.Item>
								<Select.Item value="zipzipzip3">Item4</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="createdAt">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Дата создания</Form.Label>
						<Input bind:value={$formData.createdAt} placeholder="01.02.2023" {...attrs} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="updatedAt">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Дата обновления</Form.Label>
						<Input bind:value={$formData.updatedAt} placeholder="01.02.2023" {...attrs} />
					{/snippet}
				</Form.Control>
			</Form.Field>
		</form>

		<Dialog.Footer class="mt-4 flex-col gap-3 sm:flex">
			<Button variant="outline">Сбросить</Button>
			<Button class="!ml-0" type="submit" form={$formId}><IconSearch /> Поиск</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
