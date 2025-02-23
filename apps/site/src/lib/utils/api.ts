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
	console.log('Request URL:', res.url);
	console.log('Response status:', res.status);
	console.log('Response headers:', Object.fromEntries(res.headers.entries()));

	if (!res.ok) {
		// Read the response body once
		const text = await res.text();
		try {
			// Try to parse it as JSON
			const json = JSON.parse(text);
			return err(json as { error: E });
		} catch {
			// If parsing fails, log the raw text
			console.error('Non-JSON response:', text);
			return err({ error: `Server error: ${res.status}` } as { error: E });
		}
	}

	try {
		const json = await res.json();
		return ok(json as T);
	} catch (error) {
		console.error('Failed to parse JSON response:', error);
		return err({ error: 'Invalid JSON response' } as { error: E });
	}
};
