<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { IconAlertCircle } from '@tabler/icons-svelte';

	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<Alert.Root variant="destructive">
	<IconAlertCircle class="size-4" />
	<Alert.Title>{title}</Alert.Title>
	<Alert.Description>{description}</Alert.Description>
</Alert.Root>
