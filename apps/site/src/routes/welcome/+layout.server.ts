import { authGuard } from '$lib/utils/guards';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	await authGuard(parent);
};
