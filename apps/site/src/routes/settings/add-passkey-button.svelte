<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { makeClient } from '$lib/shared/utils';
	import { IconFingerprint } from '@tabler/icons-svelte';
	import { toast } from 'svelte-sonner';
	import {
		startRegistration,
		type PublicKeyCredentialCreationOptionsJSON
	} from '@simplewebauthn/browser';
	import type { PasskeyDto } from '@repo/api/dtos';

	type Props = {
		onCreated: (passkey: PasskeyDto) => void;
	};

	const { onCreated }: Props = $props();

	let isProcessing = $state(false);

	async function addPasskey() {
		isProcessing = true;

		const client = makeClient(fetch);

		const response = await client.auth.webauthn.registration.options.$get();

		if (!response.ok) {
			const { error } = await response.json();

			if (error === 'TOO_MANY_PASSKEYS') {
				toast.error('У вас слишком много Passkeys');
			}

			return;
		}

		const { options, signature } = await response.json();

		let result;
		try {
			result = await startRegistration({
				optionsJSON: options as PublicKeyCredentialCreationOptionsJSON
			});
		} catch (error) {
			if (!(error instanceof Error)) {
				return;
			}

			if (error.name === 'InvalidStateError') {
				return toast.error('Вы уже зарегестрировали данный Passkey');
			}

			toast.error('Не удалось создать Passkey');
			return;
		}

		const verifyResponse = await client.auth.webauthn.registration.verify.$post({
			json: { originalOptions: { data: options, signature }, response: result }
		});

		if (!verifyResponse.ok) {
			toast.error('Не удалось создать Passkey');
			return;
		}

		const { passkey } = await verifyResponse.json();

		onCreated(passkey);
	}
</script>

<Button type="button" onclick={addPasskey} variant="outline"
	><IconFingerprint /> Добавить Passkey</Button
>
