import config from '@repo/config';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (config.ENV !== 'production') {
		// Request is proxied via Vite
		return await resolve(event);
	}

	if (event.url.pathname.startsWith('/api')) {
		const req = event.request;

		return await resolve({
			...event,
			request: { ...req, url: req.url.replace(/.*\/api/, 'site-api:8080') }
		});
	}

	const response = await resolve(event);
	return response;
};
