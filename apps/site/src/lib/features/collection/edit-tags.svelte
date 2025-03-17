<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { tableRowClasses } from '$lib/components/ui/table/table-row.svelte';
	import { Tag } from '$lib/entities/Tag';
	import {
		getTagBackgroundColor,
		getTagBorderColor,
		getTagTextColor
	} from '$lib/entities/Tag/tag.svelte';
	import type { TagDto } from '@repo/api/dtos';
	import {
		IconArrowLeft,
		IconDeviceFloppy,
		IconPalette,
		IconPencil,
		IconTrash,
		IconX
	} from '@tabler/icons-svelte';
	import ColorHash from 'color-hash';
	import { flip } from 'svelte/animate';
	import DeleteWithConfirm from './delete-with-confirm.svelte';

	const tagColorHash = new ColorHash({ lightness: [0.7], saturation: [0.95] });

	type Props = {
		tags: TagDto[];
	};

	const { tags: _tags }: Props = $props();

	let tags = $state([..._tags]);

	let isOpen = $state(false);

	let newTagName = $state('');

	const handleSave = () => {
		isOpen = false;
	};

	const generateColorSeed = () => {
		return window.crypto.randomUUID();
	};

	const generateColor = (seed: string) => {
		return tagColorHash.hex(seed);
	};

	let colorSeed = $state(String(Date.now()));

	let newColor = $derived(generateColor(colorSeed));

	let borderColor = $derived(getTagBorderColor(newColor));
	let color = $derived(getTagTextColor(newColor));
	let backgroundColor = $derived(getTagBackgroundColor(newColor));

	function addTag(event: Event) {
		event.preventDefault();

		// TODO call api

		tags.push({
			id: Math.random() * 1000000,
			name: newTagName.trim(),
			createdAt: new Date().toISOString(),
			hexColor: newColor
		});

		newTagName = '';
		colorSeed = generateColorSeed();
	}

	function deleteTag(id: number) {
		// TODO call api
		tags = tags.filter((tag) => tag.id !== id);
	}

	let editingTagId = $state<number | null>(null);

	// TODO make separate modal for editing / creating tag
</script>

<Button class="w-fit" onclick={() => (isOpen = true)} variant="outline">
	<span>Настроить</span>

	<div class="flex flex-row gap-1">
		{#each tags.slice(0, 3) as tag}
			<Tag {tag} ball />
		{/each}
	</div>
</Button>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Настроить тэги</Dialog.Title>
			<Dialog.Description>Здесь Вы можете настроить тэги для коллекции</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-2 py-2">
			<Table.Root>
				<Table.Body>
					{#each tags as tag (tag.id)}
						<tr class={tableRowClasses} animate:flip={{ duration: 350 }}>
							<Table.Cell>
								{#if editingTagId === tag.id}
									<Input bind:value={tag.name} />
								{:else}
									<Tag {tag} />
								{/if}
							</Table.Cell>

							<Table.Cell class="flex justify-end gap-2">
								{#if editingTagId === tag.id}
									<!-- TODO component for it -->
									<Button
										type="button"
										onclick={() => (colorSeed = generateColorSeed())}
										size="icon"
										variant="outline"
										style={`border-color: ${borderColor}; color: ${color}; background-color: ${backgroundColor};`}
									>
										<IconPalette />
									</Button>

									<Button size="icon" variant="outline" onclick={() => (editingTagId = null)}>
										<IconX />
									</Button>

									<Button size="icon" variant="outline">
										<IconDeviceFloppy />
									</Button>
								{:else}
									<Button size="icon" variant="outline" onclick={() => (editingTagId = tag.id)}>
										<IconPencil />
									</Button>

									<DeleteWithConfirm onConfirmedDelete={() => deleteTag(tag.id)} />
								{/if}
							</Table.Cell>
						</tr>
					{/each}

					<Table.Row>
						<Table.Cell>
							<form onsubmit={addTag} id="tag-form">
								<Input bind:value={newTagName} type="text" placeholder="Название тэга" />
							</form>
						</Table.Cell>

						<Table.Cell class="flex justify-end gap-2">
							<Button
								type="button"
								onclick={() => (colorSeed = generateColorSeed())}
								size="icon"
								variant="outline"
								style={`border-color: ${borderColor}; color: ${color}; background-color: ${backgroundColor};`}
							>
								<IconPalette />
							</Button>

							<Button disabled={!newTagName.trim()} form="tag-form" type="submit" size="icon">
								<IconDeviceFloppy />
							</Button>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>

		<Dialog.Footer>
			<Button variant="outline">Отменить</Button>
			<Button>Сохранить</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
