import config from '@repo/config';
import type { RequestHandler } from '@sveltejs/kit';

/** Replaces /rpc prefix with the given url */
const replaceRpcUrl = (url: string, withUrl: string) => {
	return url.replace(/.*\/rpc/, withUrl);
};

const handleRoute: RequestHandler = async ({ fetch, request }) => {
	console.log('it will be proxied', request.url, 'accept', request.headers.get('accept'));

	const targetUrl = config.ENV === 'development' ? 'http://localhost:8080' : 'http://site-api:8080';

	const newUrl = replaceRpcUrl(request.url, targetUrl);
	const transformedRequest = new Request(newUrl, request);

	const response = await fetch(transformedRequest).finally(() => {
		console.log('it was proxied', request.url, newUrl);
		return;
	});

	const headers = new Headers(response.headers);
	// https://github.com/sveltejs/kit/issues/12197
	headers.delete('content-encoding');

	// Clone the response to ensure we can read the body multiple times if needed
	const clonedResponse = response.clone();
	const body = await clonedResponse.text();

	return new Response(body, {
		headers,
		status: response.status,
		statusText: response.statusText
	});
};

export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const PATCH = handleRoute;
export const DELETE = handleRoute;
