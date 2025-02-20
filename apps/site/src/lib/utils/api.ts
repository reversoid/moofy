import type { Api } from '@repo/api';
import { hc, type ClientResponse } from 'hono/client';
import { err, ok, type Result } from 'resulto';

let browserClient: ReturnType<typeof hc<Api>>;

export const makeClient = (fetch: Window['fetch']) => {
	const isBrowser = typeof window !== 'undefined';
	const origin = isBrowser ? window.location.origin : '';

	if (isBrowser && browserClient) {
		return browserClient;
	}

	const client = hc<Api>(origin + '/api', { fetch });

	if (isBrowser) {
		browserClient = client;
	}

	return client;
};

export const handleResponse = async <T, E extends string>(
	res: ClientResponse<T | { error: E }>
): Promise<Result<T, { error: E }>> => {
	if (!res.ok) {
		return err((await res.json()) as { error: E });
	}

	return ok((await res.json()) as T);
};
