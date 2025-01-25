<script lang="ts">
	import { badgeVariants } from '$lib/components/ui/badge';
	import { IconStar } from '@tabler/icons-svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';

	function handleValueChange(value: string) {
		rating = value;
	}

	const handleResetRating = (event: MouseEvent, clickedRating: string) => {
		if (clickedRating === rating) {
			event.preventDefault();
			event.stopPropagation();

			rating = '';
		}
	};

	interface Props {
		rating?: string;
	}

	let { rating = $bindable() }: Props = $props();
</script>

<RadioGroup.Root
	class="flex justify-between gap-2"
	value={rating}
	onValueChange={handleValueChange}
>
	{#each ['1', '2', '3', '4', '5'] as value}
		<div class="flex-1 items-center justify-center">
			<RadioGroup.Item value={String(value)} id="r{value}" class="sr-only" />

			<Label
				onclick={(e) => handleResetRating(e, value)}
				for="r{value}"
				class="{badgeVariants({
					variant: rating === value ? 'default' : 'secondary'
				})} flex cursor-pointer items-center justify-center gap-1"
			>
				<IconStar size="16" />
				<span>{value}</span>
			</Label>
		</div>
	{/each}
</RadioGroup.Root>
