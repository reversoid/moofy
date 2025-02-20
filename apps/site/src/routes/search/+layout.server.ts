import type { LayoutServerLoad } from './$types';
import { authGuard } from '$lib/utils/guards';

export const load: LayoutServerLoad = async ({ parent }) => {
	await authGuard(parent);
};
