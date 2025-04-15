<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Tag } from '$lib/entities/Tag';
	import type { TagDto } from '@repo/api/dtos';

	type Props = {
		selectedTagsIds: string[];
		tags: TagDto[];
	};

	let { tags, selectedTagsIds = $bindable() }: Props = $props();

	let selectedTags = $derived(tags.filter((t) => selectedTagsIds.includes(String(t.id))));
</script>

<Select.Root bind:value={selectedTagsIds} type="multiple">
	<Select.Trigger class="gap-2">
		<div class="flex grow flex-row items-center justify-between gap-2">
			<span>Выберите теги</span>

			<div class="flex flex-row gap-1">
				{#each selectedTags.slice(0, 3) as tag}
					<Tag {tag} ball />
				{/each}
			</div>
		</div>
	</Select.Trigger>

	<Select.Content>
		{#each tags as tag}
			<Select.Item class="flex justify-between" value={String(tag.id)}>
				<span>{tag.name}</span>
				<Tag {tag} ball />
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
