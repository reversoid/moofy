import config from '@repo/config';
import type { Handle, HandleFetch } from '@sveltejs/kit';

const replaceApiUrl = (url: string) => {
	return url.replace(/.*\/api/, 'http://site-api:8080');
};

export const handle: Handle = async ({ event, resolve }) => {
	console.log('handling requestt', event.url.toString());

	if (config.ENV === 'development') {
		// Request is proxied via Vite
		return await resolve(event);
	}

	if (event.url.pathname.startsWith('/api')) {
		const newUrl = replaceApiUrl(event.url.toString());
		const newRequest = new Request(newUrl, event.request);

		console.log('newRequest', newRequest);

		const result = await resolve({
			...event,
			request: newRequest
		});

		console.log('result', await result.clone().text());

		return result;
	}

	const response = await resolve(event);
	return response;
};

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	if (config.ENV === 'development') {
		// Let Vite handle the proxying in development
		return fetch(request);
	}

	const url = new URL(request.url);
	if (url.pathname.startsWith('/api')) {
		const newUrl = replaceApiUrl(request.url);
		request = new Request(newUrl, request);
	}

	return fetch(request);
};
