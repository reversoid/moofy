<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import { setCurrentUser } from '$lib/shared/state';
	import Heading from '$lib/shared/ui/heading.svelte';
	import Image from '$lib/shared/ui/image.svelte';
	import UploadImage from '$lib/shared/ui/upload-image.svelte';
	import Wrapper from '$lib/shared/ui/wrapper.svelte';
	import {
		IconShieldLock,
		IconSnowman,
		IconTrash,
		IconUpload,
		IconUser
	} from '@tabler/icons-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ActionData, PageProps } from './$types';
	import PasskeyItem from './passkey-item.svelte';
	import { settingsSchema } from './schema';
	import AddPasskeyButton from './add-passkey-button.svelte';

	const { data }: PageProps = $props();

	let passkeys = $derived(data.passkeys);

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
</script>

<svelte:head>
	<title>Settings | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>Настройки профиля</Heading>

	<Tabs.Root class="mt-6" value="account">
		<Tabs.List>
			<Tabs.Trigger class="flex gap-1.5" value="account"
				><IconUser size={20} /> Аккаунт</Tabs.Trigger
			>
			<Tabs.Trigger class="flex gap-1.5" value="auth"
				><IconShieldLock size={20} /> Вход</Tabs.Trigger
			>
			<Tabs.Trigger class="flex gap-1.5" value="other"
				><IconSnowman size={20} /> Другое</Tabs.Trigger
			>
		</Tabs.List>

		<form use:enhance id="settings-form" method="POST" autocomplete="on">
			<Tabs.Content value="account">
				<Card.Root>
					<Card.Header>
						<Card.Title>Общая информация</Card.Title>
						<Card.Description
							>Эти данные будут видны всем, кто посещает Ваш профиль</Card.Description
						>
					</Card.Header>

					<Card.Content>
						<div class="flex w-full flex-col items-center gap-5">
							<div class="self-center sm:self-start">
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
							</div>

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
							</div>
						</div>
					</Card.Content>

					<Card.Footer>
						<Button
							isLoading={$isSubmitting}
							disabled={formState !== 'valid'}
							type="submit"
							form="settings-form"
						>
							Сохранить</Button
						>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="auth">
				<!-- <Card.Root>
					<Card.Header>
						<Card.Title>Изменить пароль</Card.Title>
						<Card.Description
							>Чтобы изменить пароль, необходимо ввести старый и новый пароль</Card.Description
						>
					</Card.Header>

					<Card.Content></Card.Content>
				</Card.Root> -->

				<Card.Root>
					<Card.Header>
						<Card.Title>Вход по Passkey</Card.Title>
						<Card.Description
							>С помощью Passkey вы можете входить в аккаунт без использования пароля
						</Card.Description>
					</Card.Header>

					<Card.Content>
						<hr class="bg-muted" />

						{#each passkeys as passkey (passkey.id)}
							<PasskeyItem
								{passkey}
								onDeleted={() => {
									passkeys = passkeys.filter((p) => p.id !== passkey.id);
								}}
							/>

							<hr class="bg-muted" />
						{/each}
					</Card.Content>

					<Card.Footer>
						<AddPasskeyButton />
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="other">
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

				<div class="mt-5">
					<Button
						isLoading={$isSubmitting}
						disabled={formState !== 'valid'}
						type="submit"
						form="settings-form"
					>
						Сохранить</Button
					>
				</div>
			</Tabs.Content>
		</form>
	</Tabs.Root>
</Wrapper>
