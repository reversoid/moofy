import { authGuard } from '$lib/shared/utils/guards';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	await authGuard(parent);
};
