<script>
	import Heading from '$lib/ui/heading.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
</script>

<svelte:head>
	<title>Roadmap | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Roadmap</Heading>

	<p class="text-muted-foreground mt-4">
		Мы постоянно работаем над улучшением нашего сервиса и добавлением новых функций.
		<br /> Здесь вы можете узнать о том, что мы планируем добавить в будущем.
	</p>

	<div class="roadmap-items mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-2">
		<div class="roadmap-item bg-muted rounded-md p-4">
			<h3 class="text-lg font-medium">Суперколлекции</h3>
			<p>
				Суперколлекции – специальные коллекции, которые могут иметь дополнительные функции. Например
				"персональная коллекция" будет отображаться у вас в профиле, а коллекция "посмотреть"
				позволит проще и удобнее отслеживать просмотренные фильмы.
			</p>
		</div>

		<div class="roadmap-item bg-muted rounded-md p-4">
			<h3 class="text-lg font-medium">Теги внутри коллекции</h3>
			<p>
				Пользователь сможет выбирать теги для фильмов, которые он добавляет в коллекции. Это
				позволит удобнее и быстрее искать фильмы.
			</p>
		</div>

		<div class="roadmap-item bg-muted rounded-md p-4">
			<h3 class="text-lg font-medium">Групповая рекомендация</h3>
			<p>
				Эта функция позволит выбрать фильм для просмотра группе пользователей, исходя из оценок,
				которые они поставили в нашем сервисе.
			</p>
		</div>

		<div class="roadmap-item bg-muted rounded-md p-4">
			<h3 class="text-lg font-medium">Social credit</h3>
			<p>[ДАННЫЕ УДАЛЕНЫ]</p>
		</div>
	</div>
</Wrapper>
