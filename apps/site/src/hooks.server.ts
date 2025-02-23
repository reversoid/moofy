import config from '@repo/config';
import type { Handle } from '@sveltejs/kit';

const replaceApiUrl = (url: string) => {
	return url.replace(/.*\/api/, 'http://site-api:8080');
};

export const handle: Handle = async ({ event, resolve }) => {
	console.log('handling requestt');

	if (config.ENV === 'development') {
		// Request is proxied via Vite
		return await resolve(event);
	}

	if (event.url.pathname.startsWith('/api')) {
		const newUrl = replaceApiUrl(event.url.toString());
		const newRequest = new Request(newUrl, event.request);

		console.log('newRequest', newRequest);

		return await resolve({
			...event,
			request: newRequest
		});
	}

	const response = await resolve(event);
	return response;
};
