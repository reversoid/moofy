<script>
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import UploadCollectionImage from './upload-collection-image.svelte';
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-3">
		<b>Название коллекции</b>
		<Input placeholder="Название" />
	</div>

	<div class="flex flex-col gap-3">
		<b>Описание коллекции</b>
		<Textarea placeholder="Описание" />
	</div>

	<div class="flex flex-col gap-3">
		<b>Обложка коллекции</b>
		<UploadCollectionImage />
	</div>
</div>
