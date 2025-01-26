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

export const handleResponse = async <T>(
	res: ClientResponse<T>
): Promise<Result<T, { error: string }>> => {
	if (!res.ok) {
		return err((await res.json()) as { error: string });
	}

	return ok(res.json() as T);
};
