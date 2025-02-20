<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperForm } from 'sveltekit-superforms';
	import type { ZodObject, ZodRawShape } from 'zod';

	export type FormState = 'valid' | 'invalid';

	interface Props {
		id: string;
		form: SuperForm<{ username: string; password: string }, any>;
		schema: ZodObject<ZodRawShape>;
		onFormStateChange: (state: FormState) => void;
	}

	let data: Props = $props();

	const form = data.form;

	const { form: formData, enhance, errors } = form;

	$effect(() => {
		const hasErrors = Object.values($errors).filter(Boolean).length > 0;
		const isEmpty = !$formData.username || !$formData.password;

		data.onFormStateChange(hasErrors || isEmpty ? 'invalid' : 'valid');
	});
</script>

<form method="POST" use:enhance id={data.id} class="flex flex-col gap-4">
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ attrs }: { attrs: any })}
				<Form.Label>Имя пользователя</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ attrs }: { attrs: any })}
				<Form.Label>Пароль</Form.Label>
				<Input {...attrs} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
</form>
