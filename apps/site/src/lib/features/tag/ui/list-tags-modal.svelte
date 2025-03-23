<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import { Tag } from '$lib/entities/Tag';
	import { makeClient } from '$lib/utils';
	import type { CollectionDto, TagDto } from '@repo/api/dtos';
	import { IconPencil, IconPlus } from '@tabler/icons-svelte';
	import { toast } from 'svelte-sonner';
	import DeleteWithConfirm from '../../collection/delete-with-confirm.svelte';
	import EditTag from './edit-tag.svelte';

	type Props = {
		isOpen: boolean;
		tags: TagDto[];
		collectionId: CollectionDto['id'];
	};

	let { tags = $bindable(), isOpen = $bindable(), collectionId }: Props = $props();

	async function deleteTag(id: number) {
		const result = await makeClient(fetch).collections[':collectionId'].tags[':tagId'].$delete({
			param: { collectionId: collectionId.toString(), tagId: id.toString() }
		});

		if (!result.ok) {
			toast.error('Не удалось удалить тег');
			throw new Error();
		}

		tags = tags.filter((tag) => tag.id !== id);
	}

	async function createTag(options: Pick<TagDto, 'name' | 'hexColor' | 'description'>) {
		const result = await makeClient(fetch).collections[':collectionId'].tags.$put({
			param: { collectionId: collectionId.toString() },
			json: { hexColor: options.hexColor, name: options.name, description: options.description }
		});

		if (!result.ok) {
			const err = await result.json();
			if (err.error === 'TAG_ALREADY_EXISTS') {
				toast.error('Тег с таким именем уже существует');
			}

			throw new Error();
		}

		const { tag } = await result.json();

		tags = [...tags, tag];
	}

	async function editTag(
		id: TagDto['id'],
		options: Pick<TagDto, 'name' | 'hexColor' | 'description'>
	) {
		const result = await makeClient(fetch).collections[':collectionId'].tags[':tagId'].$patch({
			json: { description: options.description, hexColor: options.hexColor, name: options.name },
			param: { collectionId: collectionId.toString(), tagId: id.toString() }
		});

		if (!result.ok) {
			const err = await result.json();
			if (err.error === 'TAG_ALREADY_EXISTS') {
				toast.error('Тег с таким именем уже существует');
			}

			throw new Error();
		}

		const { tag: updatedTag } = await result.json();

		const index = tags.findIndex((t) => t.id === id);
		if (index === -1) {
			return;
		}

		tags = tags.map((t) => {
			if (t.id !== id) {
				return t;
			}

			return updatedTag;
		});
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Настроить теги</Dialog.Title>
			<Dialog.Description>Здесь Вы можете настроить теги для коллекции</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-2 py-2">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Тег</Table.Head>
						<Table.Head>Описание</Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#each tags as tag (tag.id)}
						<Table.Row>
							<Table.Cell>
								<Tag {tag} />
							</Table.Cell>

							<Table.Cell>
								{#if tag.description}
									<p>{tag.description}</p>
								{:else}
									<p class="text-muted-foreground">Нет описания</p>
								{/if}
							</Table.Cell>

							<Table.Cell class="flex justify-end gap-2">
								<EditTag onSave={(v) => editTag(tag.id, v)} {tag}>
									{#snippet icon()}
										<IconPencil />
									{/snippet}
								</EditTag>

								<DeleteWithConfirm onConfirmedDelete={() => deleteTag(tag.id)} />
							</Table.Cell>
						</Table.Row>
					{/each}

					<Table.Row>
						<Table.Cell>Новый тег</Table.Cell>
						<Table.Cell></Table.Cell>
						<Table.Cell>
							<div class="flex justify-end">
								{#key tags.length}
									<EditTag onSave={createTag}>
										{#snippet icon()}
											<IconPlus />
										{/snippet}
									</EditTag>
								{/key}
							</div>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
