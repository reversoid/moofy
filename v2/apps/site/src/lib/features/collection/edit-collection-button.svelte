<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconSettings } from '@tabler/icons-svelte';

	interface Props {
		class?: string;
	}

	const { class: className }: Props = $props();
</script>

<Button class={className} tag="div" variant="secondary">
	<IconSettings />
	<span>Изменить</span>
</Button>
