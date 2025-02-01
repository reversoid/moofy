<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, handleResponse, makeClient } from '$lib/utils';
	import type { FilmDto } from '@repo/api/dtos';
	import uniqBy from 'lodash.uniqby';
	import debounce from 'lodash.debounce';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		film?: FilmDto | null;
	}

	let { film = $bindable() }: Props = $props();

	let open = $state(false);
	let inputWidth = $state(462);
	let triggerRef = $state<HTMLButtonElement>(null!);

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

	let films = $state<FilmDto[]>([]);

	async function searchFilm(search: string) {
		const api = makeClient(fetch);
		const response = await api.search.films
			.$get({ query: { limit: '5', search } })
			.then(handleResponse);

		if (response.isOk()) {
			const newFilms = response.unwrap().films;
			films = newFilms;
		}
	}

	const handleInputSearch = debounce(
		async (e: Parameters<FormEventHandler<HTMLInputElement>>[0]) => {
			await searchFilm((e.target as HTMLInputElement).value);
		},
		300
	);

	const visibleFilms = $derived(uniqBy([film, ...films].filter(Boolean) as FilmDto[], 'id'));
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
				{film?.name || 'Выберите фильм...'}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="start" class="w-full p-0">
		<Command.Root style={{ width: `${inputWidth}px` }} shouldFilter={false}>
			<Command.Input placeholder="Название фильма" oninput={handleInputSearch} />
			<Command.List>
				<Command.Empty>Фильмы не найдены</Command.Empty>
				<Command.Group>
					{#each visibleFilms as f}
						<Command.Item
							class="flex items-start gap-2"
							value={f.id}
							onSelect={() => {
								closeAndFocusTrigger();
								film = f;
							}}
						>
							<img
								src={f.posterUrl}
								alt={`${f.name} poster`}
								class="aspect-[2/3] h-20 rounded object-cover"
							/>
							<div class="flex h-full flex-col">
								<h6 class="font-medium">
									<div class="flex items-center gap-2">
										{f.name}

										<Check class={cn(film?.id !== f.id && 'text-transparent')} />
									</div>
								</h6>
								<span class="text-muted-foreground">{f.year}</span>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
