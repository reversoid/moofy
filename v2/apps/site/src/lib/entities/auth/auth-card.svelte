<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
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
				<Card.Description>Введите ваш email и пароль для входа.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="space-y-1">
					<Label for="email">Email</Label>
					<Input id="email" type="email" />
				</div>
				<div class="space-y-1">
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
				<Card.Description>Придумайте email и пароль для регистрации на Moofy.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="space-y-1">
					<Label for="email">Email</Label>
					<Input id="email" type="email" />
				</div>
				<div class="space-y-1">
					<Label for="password">Пароль</Label>
					<Input id="password" type="password" />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button>Зарегистрироваться</Button>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
