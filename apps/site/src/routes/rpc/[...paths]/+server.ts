import config from '@repo/config';
import type { RequestHandler } from '@sveltejs/kit';

/** Replaces /rpc prefix with the given url */
const replaceRpcUrl = (url: string, withUrl: string) => {
	return url.replace(/.*\/rpc/, withUrl);
};

const handleRoute: RequestHandler = ({ fetch, request }) => {
	console.log('it will be proxied', request.url, 'accept', request.headers.get('accept'));

	if (config.ENV === 'development') {
		const transformedRequest = new Request(
			replaceRpcUrl(request.url, 'http://localhost:8080'),
			request
		);
		return fetch(transformedRequest).finally(() => {
			console.log(
				'it was proxied',
				request.url,
				replaceRpcUrl(request.url, 'http://localhost:8080')
			);
			return;
		});
	}

	const transformedRequest = new Request(
		replaceRpcUrl(request.url, 'http://site-api:8080'),
		request
	);
	return fetch(transformedRequest).finally(() => {
		console.log('it was proxied', request.url, replaceRpcUrl(request.url, 'http://site-api:8080'));
		return;
	});
};

export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const PATCH = handleRoute;
export const DELETE = handleRoute;
