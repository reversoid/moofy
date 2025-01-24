<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import UploadCollectionImage from './upload-collection-image.svelte';
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-3">
		<Label for="name">Название коллекции</Label>
		<Input id="name" placeholder="Название" />
	</div>

	<div class="flex flex-col gap-3">
		<Label for="description">Описание коллекции</Label>
		<Textarea id="description" placeholder="Описание" />
	</div>

	<div class="flex flex-row items-center gap-2">
		<Checkbox id="private" aria-labelledby="private-label" />

		<Label id="private-label" for="private" class="text-sm font-medium leading-none">
			Сделать коллекцию приватной
		</Label>
	</div>

	<div class="flex flex-col gap-3">
		<Label for="image">Обложка коллекции</Label>
		<UploadCollectionImage id="image" />
	</div>
</div>
