import config from '@repo/config';
import type { RequestEvent } from '../../$types';

/** Replaces /rpc prefix with the given url */
const replaceRpcUrl = (url: string, withUrl: string) => {
	return url.replace(/.*\/rpc/, withUrl);
};

const handleRoute = ({ fetch, request }: RequestEvent) => {
	console.log('it will be proxied', request.url);

	if (config.ENV === 'development') {
		const transformedRequest = new Request(
			replaceRpcUrl(request.url, 'http://localhost:8080'),
			request
		);
		return fetch(transformedRequest).finally((data) => {
			console.log(
				'it was proxied',
				request.url,
				replaceRpcUrl(request.url, 'http://localhost:8080'),
				data
			);
			return data;
		});
	}

	const transformedRequest = new Request(
		replaceRpcUrl(request.url, 'http://site-api:8080'),
		request
	);
	return fetch(transformedRequest).finally((data) => {
		console.log(
			'it was proxied',
			request.url,
			replaceRpcUrl(request.url, 'http://site-api:8080'),
			data
		);
		return data;
	});
};

export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const PATCH = handleRoute;
export const DELETE = handleRoute;
export const OPTIONS = handleRoute;
export const HEAD = handleRoute;
