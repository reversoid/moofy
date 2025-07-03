<script lang="ts">
	import AuthCard from '$lib/entities/auth/auth-card.svelte';
	import { loginSchema } from '$lib/entities/auth/schema';
	import { setCurrentUser } from '$lib/shared/state';
	import { getContext } from 'svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageProps } from './$types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const form = data.form;

	const message = getContext('message') as { value: string };

	const loginForm = superForm(form, {
		resetForm: false,
		validators: zodClient(loginSchema),
		onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;

			if (form.valid && action.user) {
				setCurrentUser(action.user);
				return goto('/collections', { replaceState: true });
			}

			if (form.message) {
				message.value = form.message;
			}
		}
	});
</script>

<svelte:head>
	<title>Login | Moofy</title>
</svelte:head>

<AuthCard type="login" form={loginForm} />
