<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { type SuperForm } from 'sveltekit-superforms';
	import AuthForm from './auth-form.svelte';
	import { loginSchema, registerSchema } from './schema';

	interface Props {
		type: 'login' | 'register';
		form: SuperForm<{ username: string; password: string }, any>;
	}

	const { form, type }: Props = $props();

	let formState = $state<'valid' | 'invalid'>('valid');

	const title = $derived(type === 'login' ? 'Вход' : 'Регистрация');
	const description = $derived(
		type === 'login'
			? 'Введите ваше имя пользователя и пароль'
			: 'Придумайте имя пользователя и пароль'
	);
	const formId = $derived(type === 'login' ? 'login-form' : 'register-form');
	const buttonText = $derived(type === 'login' ? 'Войти' : 'Зарегистрироваться');

	const isLoading = form.submitting;
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<AuthForm
			id={formId}
			{form}
			schema={type === 'login' ? loginSchema : registerSchema}
			onFormStateChange={(newState) => (formState = newState)}
		/>
	</Card.Content>
	<Card.Footer>
		<Button isLoading={$isLoading} disabled={formState !== 'valid'} type="submit" form={formId}>
			{buttonText}
		</Button>
	</Card.Footer>
</Card.Root>
