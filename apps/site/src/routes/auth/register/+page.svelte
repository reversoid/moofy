<script lang="ts">
	import AuthCard from '$lib/entities/auth/auth-card.svelte';
	import { registerSchema } from '$lib/entities/auth/schema';
	import { setCurrentUser } from '$lib/shared/state/state.svelte';
	import { getContext } from 'svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageProps } from './$types';

	const { data }: PageProps = $props();

	const { form } = data;

	const message = getContext('message') as { value: string };

	const registerForm = superForm(form, {
		validators: zodClient(registerSchema),
		onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;

			if (form.valid && action.user) {
				setCurrentUser(action.user);
			}

			if (form.message) {
				message.value = form.message;
			}
		}
	});
</script>

<svelte:head>
	<title>Register | Moofy</title>
</svelte:head>

<AuthCard form={registerForm} type="register" />
