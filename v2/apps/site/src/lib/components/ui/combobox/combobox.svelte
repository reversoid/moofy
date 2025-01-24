<script lang="ts">
	import Input from '../input/input.svelte';

	interface ComboboxProps {
		id: string;
	}

	const { id }: ComboboxProps = $props();
</script>

<Input placeholder="Название фильма" />
