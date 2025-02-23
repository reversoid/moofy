import config from '@repo/config';
import type { RequestEvent } from '../../$types';

/** Replaces /api prefix with the given url */
const replaceApiUrl = (url: string, withUrl: string) => {
	return url.replace(/.*\/api/, withUrl);
};

const handleRoute = ({ fetch, request }: RequestEvent) => {
	console.log('it will be proxied', request.url);

	if (config.ENV === 'development') {
		const transformedRequest = new Request(
			replaceApiUrl(request.url, 'http://localhost:8080'),
			request
		);
		return fetch(transformedRequest).finally((data) => {
			console.log(
				'it was proxied',
				request.url,
				replaceApiUrl(request.url, 'http://localhost:8080'),
				data
			);
		});
	}

	const transformedRequest = new Request(
		replaceApiUrl(request.url, 'http://site-api:8080'),
		request
	);
	return fetch(transformedRequest).finally((data) => {
		console.log(
			'it was proxied',
			request.url,
			replaceApiUrl(request.url, 'http://site-api:8080'),
			data
		);
	});
};

export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const PATCH = handleRoute;
export const DELETE = handleRoute;
export const OPTIONS = handleRoute;
export const HEAD = handleRoute;
