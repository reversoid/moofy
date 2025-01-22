<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { flyAndScale } from '$lib/utils';
	import { IconPlus, IconStar } from '@tabler/icons-svelte';
</script>

<Dialog.Header>
	<Dialog.Title>Добавить обзор</Dialog.Title>
</Dialog.Header>

<div class="grid gap-4 py-4">
	<b>Название фильма</b>
	<Combobox />
	<b>Описание</b>
	<Textarea placeholder="Описание..." />
	<b>Оценка</b>
	<div class="flex items-center justify-between gap-6 max-sm:gap-2">
		<Badge variant="secondary" class="flex-1 justify-center">
			<IconStar class="mr-1" size="16" />
			<span>1</span>
		</Badge>
		<Badge variant="secondary" class="flex-1 justify-center">
			<IconStar class="mr-1" size="16" />
			<span>2</span>
		</Badge><Badge class="flex-1 justify-center">
			<IconStar class="mr-1" size="16" />
			<span>3</span>
		</Badge><Badge variant="secondary" class="flex-1 justify-center">
			<IconStar class="mr-1" size="16" />
			<span>4</span>
		</Badge><Badge variant="secondary" class="flex-1 justify-center">
			<IconStar class="mr-1" size="16" />
			<span>5</span>
		</Badge>
	</div>
</div>
<Dialog.Footer>
	<Button type="submit">Сохранить</Button>
</Dialog.Footer>
