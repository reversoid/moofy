<script lang="ts">
	interface Props {
		name: string;
		year: string;
		posterUrl: string;
	}

	const { name, year, posterUrl }: Props = $props();
</script>

<div class="bg-secondary flex flex-row gap-4 rounded-lg p-4">
	<img src={posterUrl} class="aspect-[2/3] h-20 rounded-lg object-cover" alt="s" />

	<div class="flex flex-col gap-1">
		<b>{name}</b>
		<p class="text-muted-foreground text-sm">{year}</p>
	</div>
</div>
