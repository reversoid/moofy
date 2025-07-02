<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description: string;
		onSubmit: (value: string) => Promise<void>;
		defaultValue: string;
		label: string;
		children: Snippet;
	};

	let { title, description, onSubmit, defaultValue, label, children }: Props = $props();

	let isOpen = $state(false);
	let isLoading = $state(false);
	let value = $derived(defaultValue);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger type="button">
		{@render children()}
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>

		<div>
			<Label>{label}</Label>
			<div class="mt-2">
				<Input bind:value />
			</div>
		</div>

		<Dialog.Footer class="mt-3">
			<Button
				{isLoading}
				onclick={async () => {
					isLoading = true;
					await onSubmit(value);
					isLoading = false;
					isOpen = false;
				}}
			>
				Сохранить
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
