<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Tag from '$lib/entities/Tag/tag.svelte';
	import type { CollectionDto, TagDto } from '@repo/api/dtos';
	import ListTagsModal from './list-tags-modal.svelte';

	let isOpen = $state(false);

	type Props = {
		tags: TagDto[];
		collectionId: CollectionDto['id'];
	};

	let { tags = $bindable(), collectionId }: Props = $props();
</script>

<Button class="w-fit" onclick={() => (isOpen = true)} variant="outline">
	<span>Настроить</span>

	{#if tags.length}
		<div class="flex flex-row gap-1">
			{#each tags.slice(0, 3) as tag}
				<Tag {tag} ball />
			{/each}
		</div>
	{/if}
</Button>

<ListTagsModal {collectionId} bind:isOpen bind:tags />
