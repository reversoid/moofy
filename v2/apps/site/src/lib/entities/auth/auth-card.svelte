<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { enhance } from '$app/forms';
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
				<Card.Description class="!mt-2"
					>Введите ваше имя пользователя и пароль для входа</Card.Description
				>
			</Card.Header>
			<Card.Content class="flex flex-col gap-4">
				<div class="flex flex-col gap-3">
					<Label for="username">Имя пользователя</Label>
					<Input id="username" type="text" />
				</div>
				<div class="flex flex-col gap-3">
					<Label for="password">Пароль</Label>
					<Input id="password" type="password" />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button>Войти</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="register">
		<Card.Root>
			<Card.Header>
				<Card.Title>Регистрация</Card.Title>
				<Card.Description class="!mt-2"
					>Придумайте имя пользователя и пароль для регистрации</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<form use:enhance id="register-form" class="flex flex-col gap-4">
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
				<Button form="register-form">Зарегистрироваться</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
