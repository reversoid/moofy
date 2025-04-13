<script lang="ts">
	import Image from '$lib/shared/ui/image.svelte';

	interface Props {
		name: string;
		year: number;
		posterUrl: string;
	}

	const { name, year, posterUrl }: Props = $props();
</script>

<div class="bg-secondary flex flex-row gap-4 rounded-lg p-4">
	<Image src={posterUrl} class="aspect-[2/3] h-20 rounded-lg object-cover" alt="s" />

	<div class="flex flex-col gap-1">
		<b>{name}</b>
		<p class="text-muted-foreground text-sm">{year}</p>
	</div>
</div>
