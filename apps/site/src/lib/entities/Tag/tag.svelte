<script lang="ts" module>
	export const getTagTextColor = (hexColor: string) => {
		return Color(hexColor).toString();
	};

	export const getTagBackgroundColor = (hexColor: string) => {
		return Color(hexColor).alpha(0.18).toString();
	};

	export const getTagBorderColor = (hexColor: string) => {
		return Color(hexColor).alpha(0.2).toString();
	};
</script>

<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import type { TagDto } from '@repo/api/dtos';
	import Color from 'color';
	import type { Snippet } from 'svelte';
	import type { ClassNameValue } from 'tailwind-merge';

	interface Props {
		tag: TagDto;
		class?: ClassNameValue;
		ball?: boolean;
		children?: Snippet;
	}

	const { tag, class: className, ball, children }: Props = $props();

	const textColor = $derived(getTagTextColor(tag.hexColor));
	const borderColor = $derived(getTagBorderColor(tag.hexColor));
	const bgColor = $derived(getTagBackgroundColor(tag.hexColor));
</script>

<Badge
	class={cn('border-2 py-1', ball && 'rounded-full px-1 py-1', className)}
	variant="outline"
	style="background-color: {bgColor}; color: {textColor}; border-color: {borderColor};"
>
	{#if ball}
		<div class="h-2 w-2 rounded-full" style="background-color: {textColor}"></div>
	{:else}
		{tag.name}
	{/if}

	{@render children?.()}
</Badge>
