<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import type { TagDto } from '@repo/api/dtos';
	import Color from 'color';

	interface Props {
		tag: TagDto;
		ball?: boolean;
	}

	const { tag, ball = false }: Props = $props();

	const textColor = $derived(Color(tag.hexColor).lighten(0.5).toString());
	const borderColor = $derived(Color(tag.hexColor).alpha(0.2).toString());
	const bgColor = $derived(Color(tag.hexColor).alpha(0.18).toString());
	const ballColor = $derived(Color(tag.hexColor).lighten(0.5).alpha(0.75).toString());
</script>

<Badge
	class={cn('border-2 py-1', ball && 'rounded-full', ball && 'px-2 py-2')}
	variant="outline"
	style="background-color: {bgColor}; color: {textColor}; border-color: {borderColor};"
>
	{#if ball}
		<div class="h-2 w-2 rounded-full" style="background-color: {ballColor};"></div>
	{:else}
		{tag.name}
	{/if}
</Badge>
