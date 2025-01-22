<script>
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { ReviewsList } from '$lib/widgets/reviews-list';
	import { IconPlus } from '@tabler/icons-svelte';
</script>

<Wrapper>
	<Heading>Collection 1</Heading>

	<div class="mt-6 grid grid-cols-[4fr_1fr] gap-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Описание</Card.Title>
			</Card.Header>

			<Card.Content>
				<p>Some description</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>О коллекции</Card.Title>
			</Card.Header>

			<Card.Content>
				<ul class="flex flex-col gap-1">
					<li>Создатель: <Link href="/users/reversoid">reversoid</Link></li>
					<li>Обновлено: 12.01.2025</li>
					<li>Приватная коллекция</li>
				</ul>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="mt-6 flex items-center justify-between gap-4">
		<Heading type="h2">Обзоры</Heading>
		<Button>
			<IconPlus class="mr-2" size="20" />
			<span>Добавить</span>
		</Button>
	</div>

	<div class="mt-4">
		<ReviewsList />
	</div>
</Wrapper>
