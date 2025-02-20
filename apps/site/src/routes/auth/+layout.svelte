<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { IconAlertCircle } from '@tabler/icons-svelte';
	import { setContext, untrack } from 'svelte';
	import { page } from '$app/state';
	import { AuthAlert } from '$lib/entities/auth';

	const { children } = $props();

	let message = $state<{ value: string | null }>({ value: null });
	setContext('message', message);

	let activeTab: 'login' | 'register' = $derived(
		page.url.pathname === '/auth/login' ? 'login' : 'register'
	);

	$effect(() => {
		activeTab;

		message.value = null;
		untrack(() => message.value);
	});
</script>

<Wrapper class="flex min-h-[inherit] w-full max-w-md flex-col items-center justify-center gap-2">
	<Tabs.Root value={activeTab} class="w-full">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="login">
				<a class="block w-full" href="/auth/login">Вход</a>
			</Tabs.Trigger>

			<Tabs.Trigger value="register">
				<a class="block w-full" href="/auth/register">Регистрация</a>
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	{#if message.value === 'INVALID_CREDENTIALS'}
		<AuthAlert title="Ошибка" description="Неправильное имя пользователя или пароль" />
	{/if}

	{#if message.value === 'USERNAME_EXISTS'}
		<AuthAlert title="Ошибка" description="Имя пользователя уже занято" />
	{/if}

	{@render children()}
</Wrapper>
