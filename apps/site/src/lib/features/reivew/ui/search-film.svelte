<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, makeClient } from '$lib/shared/utils';
	import type { FilmDto, ProviderFilmDto } from '@repo/api/dtos';
	import uniqBy from 'lodash.uniqby';
	import debounce from 'lodash.debounce';
	import type { FormEventHandler } from 'svelte/elements';
	import Image from '$lib/shared/ui/image.svelte';
	import { FilmType } from '@repo/core/entities';
	import { ProviderFilmType } from '@repo/core/film-providers';

	// TODO make better flow with working with provider and entity films

	const providerFilmToFilm = (f: ProviderFilmDto): FilmDto => {
		return { ...f, id: Number(f.id), type: FilmType[f.type], kinopoiskId: f.id };
	};

	const filmToProviderFilm = (f: FilmDto): ProviderFilmDto => {
		return { ...f, id: String(f.id), type: ProviderFilmType[f.type] };
	};

	interface Props {
		filmId?: ProviderFilmDto['id'] | null;
		film?: FilmDto | null;
	}

	let { filmId = $bindable(), film = $bindable() }: Props = $props();

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

	let films = $state<ProviderFilmDto[]>([]);

	let isLoading = $state(false);

	const visibleFilms = $derived(
		uniqBy(
			[film ? filmToProviderFilm(film) : null, ...films].filter((v) => !!v),
			'id'
		)
	);

	async function searchFilm(search: string) {
		const api = makeClient(fetch);
		const response = await api.search.films.$get({ query: { limit: '5', search } });

		if (response.ok) {
			const { films: newFilms } = await response.json();
			films = newFilms;
		}
	}

	const handleInputSearch = debounce(
		async (e: Parameters<FormEventHandler<HTMLInputElement>>[0]) => {
			isLoading = true;
			await searchFilm((e.target as HTMLInputElement).value);
			isLoading = false;
		},
		300
	);
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
			<Command.Input {isLoading} placeholder="Название фильма" oninput={handleInputSearch} />

			<Command.List>
				<Command.Empty>Фильмы не найдены</Command.Empty>

				{#if visibleFilms.length > 0}
					<Command.Group>
						{#each visibleFilms as f (f.id)}
							<Command.Item
								class="flex items-start gap-2"
								value={String(f.id)}
								onSelect={() => {
									closeAndFocusTrigger();
									film = providerFilmToFilm(f);
									filmId = f.id;
								}}
							>
								<div class="border-primary-foreground rounded border">
									<Image
										src={f.posterPreviewUrl}
										alt={`${f.name} poster`}
										class="aspect-[2/3] h-20 rounded object-cover"
									/>
								</div>

								<div class="flex h-full flex-col">
									<h6 class="font-medium">
										<div class="flex items-center gap-2">
											{f.name}

											<Check class={cn(String(film?.id) !== f.id && 'text-transparent')} />
										</div>
									</h6>
									<span class="text-muted-foreground">{f.year}</span>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
