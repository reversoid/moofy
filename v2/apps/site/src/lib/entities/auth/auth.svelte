<script lang="ts">
	import AuthButton from './auth-button.svelte';
	import AuthModal from './auth-modal.svelte';
</script>

<AuthModal>
	{#snippet trigger()}
		<AuthButton />
	{/snippet}
</AuthModal>
