<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import EditTagModal from './edit-tag-modal.svelte';
	import type { TagDto } from '@repo/api/dtos';
	import type { Snippet } from 'svelte';

	let isOpen = $state(false);

	type Props = {
		tag?: TagDto;
		icon: Snippet;
		onSave: (options: Pick<TagDto, 'name' | 'hexColor' | 'description'>) => Promise<unknown>;
	};

	const { tag, icon, onSave }: Props = $props();
</script>

<Button onclick={() => (isOpen = true)} size="icon" variant="outline">
	{@render icon()}
</Button>

<EditTagModal bind:isOpen {tag} {onSave} />
