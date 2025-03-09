<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { IconLock } from '@tabler/icons-svelte';
</script>

<Tooltip.Provider>
	<Tooltip.Root class="relative">
		<Tooltip.Trigger>
			<IconLock class="text-muted-foreground" size={20} />
		</Tooltip.Trigger>

		<!-- <Tooltip.Content class="max-w-[320px] text-sm">
			<p>
				Эту коллекцию можете просматривать только вы<br />
				Изменить данное поведение можно в настройках коллекции
			</p>
		</Tooltip.Content> -->
	</Tooltip.Root>
</Tooltip.Provider>
