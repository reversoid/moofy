import type { Api } from '@repo/api';
import { hc } from 'hono/client';

let browserClient: ReturnType<typeof hc<Api>>;

export const makeClient = (fetch: Window['fetch']) => {
	const isBrowser = typeof window !== 'undefined';
	const origin = isBrowser ? window.location.origin : '';

	if (isBrowser && browserClient) {
		return browserClient;
	}

	const client = hc<Api>(origin + '/rpc', { fetch, headers: { accept: 'application/json' } });

	if (isBrowser) {
		browserClient = client;
	}

	return client;
};
