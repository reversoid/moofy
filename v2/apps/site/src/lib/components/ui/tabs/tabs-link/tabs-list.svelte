<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<div
	class="bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1"
>
	{@render children?.()}
</div>
