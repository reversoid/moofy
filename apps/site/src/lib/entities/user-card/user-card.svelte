<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { FollowButton } from '$lib/features/profile';
	import { globalState } from '$lib/state/state.svelte';
	import Image from '$lib/ui/image.svelte';
	import type { UserDto } from '@repo/api/dtos';
	import { IconUser } from '@tabler/icons-svelte';

	const currentUser = globalState.currentUser;

	interface Props {
		username: string;
		description: string | null;
		imageUrl: string | null;
		userId: UserDto['id'];
		isFollowing: boolean;
	}

	const { username, description, imageUrl, userId, isFollowing }: Props = $props();
</script>

<a class="block h-full" aria-label="Profile {username}" href="/profiles/{username}">
	<Card.Root class="flex h-full flex-col justify-between gap-4">
		<div class="flex flex-row justify-between gap-4 max-sm:flex-col-reverse max-sm:items-center">
			<Card.Header class="pr-0 max-sm:px-4 max-sm:pt-0">
				<Card.Title class="max-sm:text-center">{username}</Card.Title>
				<Card.Description class="max-sm:text-center"
					>{description ?? 'Нет описания'}</Card.Description
				>
			</Card.Header>

			<Card.Content class="shrink-0 pl-0 max-sm:px-0 max-sm:pb-0">
				{#if imageUrl}
					<Image class="size-20 rounded-full" src={imageUrl} alt="User" />
				{:else}
					<div class="bg-muted flex size-20 items-center justify-center rounded-full">
						<IconUser />
					</div>
				{/if}
			</Card.Content>
		</div>

		{#if currentUser?.id !== userId}
			<Card.Footer class="max-sm:px-4">
				<FollowButton {userId} {isFollowing} disabled={!currentUser} />
			</Card.Footer>
		{/if}
	</Card.Root>
</a>
