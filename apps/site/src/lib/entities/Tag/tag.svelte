<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import type { TagDto } from '@repo/api/dtos';
	import Color from 'color';

	interface Props {
		tag: TagDto;
	}

	const { tag }: Props = $props();

	const textColor = $derived(Color(tag.hexColor).lighten(0.5).toString());
	const borderColor = $derived(Color(tag.hexColor).alpha(0.2).toString());
	const bgColor = $derived(Color(tag.hexColor).alpha(0.18).toString());
	const ballColor = $derived(Color(tag.hexColor).lighten(0.5).alpha(0.75).toString());
</script>

<Badge
	class={cn('border-2 py-1')}
	variant="outline"
	style="background-color: {bgColor}; color: {textColor}; border-color: {borderColor};"
>
	{tag.name}
</Badge>
