<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { type SuperForm } from 'sveltekit-superforms';
	import AuthForm from './auth-form.svelte';
	import { loginSchema, registerSchema } from './schema';
	import { IconFingerprint } from '@tabler/icons-svelte';
	import { makeClient } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';
	import {
		startAuthentication,
		type PublicKeyCredentialRequestOptionsJSON
	} from '@simplewebauthn/browser';
	import { setCurrentUser } from '$lib/shared/state';
	import { goto } from '$app/navigation';

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

	async function loginWithPasskey() {
		const client = makeClient(fetch);
		const response = await client.auth.webauthn.auth.options.$get();
		if (!response.ok) {
			toast.error('Не удалось использовать Passkey');
		}

		const { options, signature } = await response.json();

		let result;

		try {
			result = await startAuthentication({
				optionsJSON: options as PublicKeyCredentialRequestOptionsJSON
			});
		} catch (error) {
			toast.error('Не удалось использовать Passkey');
			return;
		}

		const verifyResponse = await client.auth.webauthn.auth.verify.$post({
			json: { originalOptions: { data: options, signature }, response: result }
		});

		if (!verifyResponse.ok) {
			toast.error('Не удалось использовать Passkey');
			return;
		}

		const { user } = await verifyResponse.json();

		setCurrentUser(user);
		return goto('/collections', { replaceState: true });
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<AuthForm
			{type}
			id={formId}
			{form}
			schema={type === 'login' ? loginSchema : registerSchema}
			onFormStateChange={(newState) => (formState = newState)}
		/>
	</Card.Content>
	<Card.Footer class="flex flex-col gap-2">
		<Button
			class="w-full"
			isLoading={$isLoading}
			disabled={formState !== 'valid'}
			type="submit"
			form={formId}
		>
			{buttonText}
		</Button>

		{#if type === 'login'}
			<Button onclick={loginWithPasskey} class="w-full" type="button" variant="outline">
				<IconFingerprint />
				Passkey
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
