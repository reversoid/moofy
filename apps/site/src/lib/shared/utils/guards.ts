import type { UserDto } from '@repo/api/dtos';
import { redirect } from '@sveltejs/kit';

// TODO use restrict('auth' | 'noauth') instead

/** Redirects to login page if user is not authenticated */
export const authGuard = async (
	parent: () => Promise<{ user: UserDto | null }>
): never | Promise<{ user: UserDto }> => {
	const { user } = await parent();

	if (!user) {
		throw redirect(307, '/auth/login');
	}

	return { user };
};
