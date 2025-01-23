<script>
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import CreateCollectionForm from './create-collection-form.svelte';
</script>

<Dialog.Header>
	<Dialog.Title>Создать коллекцию</Dialog.Title>
	<Dialog.Description>Коллекции позволяют группировать фильмы</Dialog.Description>
</Dialog.Header>

<CreateCollectionForm />

<Dialog.Footer>
	<Button>Создать</Button>
</Dialog.Footer>
