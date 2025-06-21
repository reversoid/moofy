<script lang="ts">
	import { goto } from '$app/navigation';
	import { makeClient } from '$lib/shared/utils';
	import { toast } from 'svelte-sonner';

	$effect(() => {
		void makeClient(fetch)
			.changelog.new.$get()
			.then(async (r) => {
				if (!r.ok) {
					return;
				}

				const { hasNewUpdates } = await r.json();

				if (!hasNewUpdates) {
					return;
				}

				toast.info('Вышло новое обновление!', {
					duration: 8_000,
					invert: true,
					action: {
						label: 'Смотреть',
						onClick() {
							goto('/changelog');
						}
					},
					onAutoClose() {
						void makeClient(fetch).changelog.views.$post();
					}
				});
			});
	});
</script>
