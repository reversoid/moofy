<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { setCurrentUser } from '$lib/state/state.svelte';
	import Image from '$lib/ui/image.svelte';
	import UploadImage from '$lib/ui/upload-image.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { IconTrash, IconUpload, IconUser, IconX } from '@tabler/icons-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageProps } from './$types';
	import { settingsSchema } from './schema';

	const { data }: PageProps = $props();

	const form = superForm(data.form, {
		validators: zodClient(settingsSchema),
		resetForm: false,
		onUpdate({ form, result }) {
			const action = result.data as FormResult<ActionData>;

			if (form.valid && action.user) {
				setCurrentUser(action.user);
				toast.success('Профиль успешно обновлен');
			}

			if (form.message) {
				toast.error(
					form.message === 'USERNAME_EXISTS' ? 'Имя пользователя уже занято' : form.message
				);
			}
		}
	});

	const { enhance, form: formData, errors } = form;

	const isSubmitting = form.submitting;

	const formState = $derived.by(() => {
		const hasErrors = Object.values($errors).filter(Boolean).length > 0;
		const isEmpty = !$formData.username;
		return hasErrors || isEmpty ? 'invalid' : 'valid';
	});

	const username = $derived(data.user.username);
</script>

<svelte:head>
	<title>Settings | Moofy</title>
</svelte:head>

<Wrapper>
	<Card.Root class="mx-auto max-w-md">
		<Card.Header>
			<Card.Title class="flex items-center justify-between">
				<span> Настройки профиля </span>
				<Button href="/profiles/{username}" size="icon" variant="ghost">
					<IconX />
				</Button>
			</Card.Title>
			<Card.Description>Вы можете изменить свои данные здесь</Card.Description>
		</Card.Header>

		<Card.Content>
			<form
				use:enhance
				id="settings-form"
				method="POST"
				class="mt-4 flex flex-col items-center gap-6"
				autocomplete="on"
			>
				<div class="flex w-full flex-col items-center gap-5">
					{#if $formData.imageUrl}
						<Image
							src={$formData.imageUrl}
							alt="avatar"
							class="size-40 rounded-full object-cover"
						/>
					{:else}
						<div class="bg-muted flex size-40 items-center justify-center rounded-full">
							<IconUser />
						</div>
					{/if}

					<div class="mt-2 flex w-full flex-col gap-3">
						<Form.Field {form} name="imageUrl">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: any })}
									<Label>Изображение профиля</Label>

									<div class="flex w-full flex-col gap-3">
										<div class="flex w-full gap-2">
											<div>
												<UploadImage
													inputAttributes={attrs}
													resource="user"
													bind:imageUrl={$formData.imageUrl}
												>
													{#snippet children({ isLoading })}
														<Button {isLoading} variant="outline" type="button">
															<IconUpload />
															<span>Загрузить</span>
														</Button>
													{/snippet}
												</UploadImage>
											</div>

											<Button
												variant="outline"
												type="button"
												onclick={() => ($formData.imageUrl = null)}
											>
												<IconTrash />
												<span>Удалить</span>
											</Button>
										</div>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
							<span class="text-muted-foreground text-sm">
								Изображение будет преобразовано с соотношением сторон&nbsp;1:1
							</span>
						</Form.Field>

						<Form.Field {form} name="username">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: any })}
									<Form.Label>Имя пользователя</Form.Label>
									<Input {...attrs} bind:value={$formData.username} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="description">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: any })}
									<Form.Label>Описание профиля</Form.Label>
									<Textarea {...attrs} bind:value={$formData.description} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="notifyUpdateType">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: any })}
									<Select.Root bind:value={$formData.notifyUpdateType} {...attrs} type="multiple">
										<Select.Trigger>Уведомлять об обновлениях</Select.Trigger>
										<Select.Content>
											<Select.Item value="feature">Новое</Select.Item>
											<Select.Item value="improvement">Улучшения</Select.Item>
											<Select.Item value="bugfix">Исправления</Select.Item>
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
						</Form.Field>
					</div>
				</div>
			</form>
		</Card.Content>

		<Card.Footer class="pt-3">
			<Button
				isLoading={$isSubmitting}
				disabled={formState !== 'valid'}
				type="submit"
				class="w-full"
				form="settings-form"
			>
				Сохранить</Button
			>
		</Card.Footer>
	</Card.Root>
</Wrapper>
