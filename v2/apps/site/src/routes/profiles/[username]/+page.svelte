<script>
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import CreateCollectionCard from '$lib/features/collection/create-collection-card.svelte';
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import { IconSettings } from '@tabler/icons-svelte';
</script>

<Wrapper>
	<div
		class="grid grid-cols-[1fr_5fr] gap-12 max-xl:grid-cols-[1fr_4fr] max-xl:gap-10 max-lg:grid-cols-[1fr_3fr] max-md:grid-cols-1"
	>
		<div class="flex flex-col gap-5 max-md:items-center">
			<img
				src="https://picsum.photos/200/200"
				alt="Profile avatar"
				class="aspect-square w-full rounded-full object-cover max-md:size-36"
			/>
			<h1 class="text-center text-2xl font-medium">reversoid</h1>

			<!-- <Button>
				<IconUserPlus />
				<span>Подписаться</span>
			</Button>

			<Button>
				<IconUserMinus />
				<span>Отписаться</span>
			</Button> -->

			<ul class="flex flex-col justify-between gap-1 text-sm">
				<li class="text-center">
					<Link href="followers">
						<span>Подписчики</span>
						<span>100</span>
					</Link>
				</li>

				<li class="text-center">
					<Link href="followees">
						<span>Подписки</span>
						<span>1</span>
					</Link>
				</li>
			</ul>

			<div class="flex w-full flex-col gap-4">
				<Textarea placeholder="Описание" />
			</div>

			<Button class="w-full" variant="outline">
				<IconSettings />
				<span>Настройки</span>
			</Button>
		</div>

		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<Heading type="h2">Коллекции</Heading>
				<CollectionsGrid>
					{#snippet firstCard()}
						<CreateCollectionCard />
					{/snippet}
				</CollectionsGrid>
			</div>

			<div class="flex flex-col gap-4">
				<Heading type="h2">Избранное</Heading>
				<CollectionsGrid />
			</div>
		</div>
	</div></Wrapper
>
