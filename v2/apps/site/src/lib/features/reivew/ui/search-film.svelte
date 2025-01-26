<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	const films = [
		{
			value: 'sveltekit',
			label: 'SvelteKit'
		},
		{
			value: 'next.js',
			label: 'Next.js'
		},
		{
			value: 'nuxt.js',
			label: 'Nuxt.js'
		},
		{
			value: 'remix',
			label: 'Remix'
		},
		{
			value: 'astro',
			label: 'Astro'
		}
	];

	let open = $state(false);
	let value = $state('');
	let inputWidth = $state(462);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(films.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	$effect(() => {
		if (triggerRef) {
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					inputWidth = entry.borderBoxSize[0].inlineSize;
				}
			});

			resizeObserver.observe(triggerRef);

			return () => resizeObserver.disconnect();
		}
	});
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Выберите фильм...'}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="start" class="w-full p-0">
		<Command.Root style={{ width: `${inputWidth}px` }}>
			<Command.Input placeholder="Название фильма" />
			<Command.List>
				<Command.Empty>Фильмы не найдены</Command.Empty>
				<Command.Group>
					{#each films as film}
						<Command.Item
							value={film.value}
							onSelect={() => {
								value = film.value;
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn(value !== film.value && 'text-transparent')} />
							{film.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
