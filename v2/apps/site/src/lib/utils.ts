import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { hc } from 'hono/client';
import type { Api } from '@repo/api';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
