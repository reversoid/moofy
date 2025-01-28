<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { makeClient, handleResponse } from '$lib/utils';
	import type { UserDto } from '@repo/api/dtos';

	const api = makeClient(fetch);

	let username = $state('');
	let password = $state('');

	async function login() {
		const response = await api.auth.login
			.$post({ json: { username, password } })
			.then(handleResponse);

		if (response.isOk()) {
			const { user } = response.value;

			onSuccess(user);
		}
	}

	async function register() {
		const response = await api.auth.register
			.$post({ json: { username, password } })
			.then(handleResponse);

		if (response.isOk()) {
			const { user } = response.value;
			onSuccess(user);
		}
	}

	interface Props {
		onSuccess: (user: UserDto) => void;
	}

	const { onSuccess }: Props = $props();
</script>

<Tabs.Root value="login">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="login">Вход</Tabs.Trigger>
		<Tabs.Trigger value="register">Регистрация</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="login">
		<Card.Root>
			<Card.Header>
				<Card.Title>Вход</Card.Title>
				<Card.Description>Введите ваше имя пользователя и пароль для входа</Card.Description>
			</Card.Header>
			<Card.Content>
				<form onsubmit={login} id="login-form" class="flex flex-col gap-4">
					<div class="flex flex-col gap-3">
						<Label for="username">Имя пользователя</Label>
						<Input id="username" type="text" bind:value={username} />
					</div>

					<div class="flex flex-col gap-3">
						<Label for="password">Пароль</Label>
						<Input id="password" type="password" bind:value={password} />
					</div>
				</form>
			</Card.Content>
			<Card.Footer>
				<Button type="submit" form="login-form">Войти</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="register">
		<Card.Root>
			<Card.Header>
				<Card.Title>Регистрация</Card.Title>
				<Card.Description>Придумайте имя пользователя и пароль для регистрации</Card.Description>
			</Card.Header>
			<Card.Content>
				<form onsubmit={register} id="register-form" class="flex flex-col gap-4">
					<div class="flex flex-col gap-3">
						<Label for="username">Имя пользователя</Label>
						<Input id="username" type="text" />
					</div>

					<div class="flex flex-col gap-3">
						<Label for="password">Пароль</Label>
						<Input id="password" type="password" />
					</div>
				</form>
			</Card.Content>
			<Card.Footer>
				<Button type="submit" form="register-form">Зарегистрироваться</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
