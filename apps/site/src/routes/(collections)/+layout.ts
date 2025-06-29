import { authGuard } from '$lib/shared/utils/guards.js';

export const load = async ({ parent }) => {
	await authGuard(parent);
};
