<script>
	import { Button } from '$lib/components/ui/button';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import { IconBrandTelegram, IconMail } from '@tabler/icons-svelte';
</script>

<svelte:head>
	<title>Support | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Поддержка</Heading>
	<p class="text-muted-foreground mt-4">
		Если у вас возникли вопросы или проблемы с использованием нашего сервиса, пожалуйста, обратитесь
		к нам.
	</p>

	<div class="support-items mt-4 flex gap-4">
		<Button target="_blank" href="mailto:grenka7777777@gmail.com" class="rounded-full">
			<IconMail />
			Email
		</Button>

		<Button target="_blank" href="https://t.me/xoxo_gosha" class="rounded-full">
			<IconBrandTelegram />
			Telegram
		</Button>
	</div>
</Wrapper>
