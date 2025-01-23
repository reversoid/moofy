<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let needConfirm = false;

	function handleDeleteClick() {
		console.log('click');

		needConfirm = true;
	}
</script>

<Button type="button" variant="destructive" on:click={handleDeleteClick}>
	{needConfirm ? 'Подтвердить' : 'Удалить'}
</Button>
