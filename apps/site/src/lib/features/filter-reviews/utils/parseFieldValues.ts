import type { DateRange, DateValue, NumericRange, NumericValue } from './types';
import { dayjs } from '@repo/core/sdk';

const parseDateString = (v: string) => dayjs(v, 'DD.MM.YYYY', true);

const isIntString = (v: string): v is NumericValue => Number.isInteger(Number(v));
const isDateString = (v: string): v is DateValue =>
	v.split('.').length === 3 && parseDateString(v).isValid();

const parseNumericToken = (token: string): NumericValue | NumericRange => {
	const [from, to] = token.split('-') as [string, string | undefined];

	if (!to) {
		if (!isIntString(from)) {
			throw new Error('Value is not an integer');
		}

		return from;
	}

	if (!isIntString(from) || !isIntString(to)) {
		throw new Error('Value is not an integer');
	}

	return `${from}-${to}`;
};

const parseDateToken = (token: string): DateValue | DateRange => {
	const [from, to] = token.split('-') as [string, string | undefined];

	if (!to) {
		if (!isDateString(from)) {
			throw new Error('Value is not a date');
		}

		return from;
	}

	if (!isDateString(from) || !isDateString(to)) {
		throw new Error('Value is not a date');
	}

	return `${from}-${to}`;
};

export const parseNumericField = (value: string): (NumericValue | NumericRange)[] => {
	const splittedTokens = value.replace(/ /g, '').split(',');
	return splittedTokens.map(parseNumericToken);
};

export const parseDateField = (value: string): (DateValue | DateRange)[] => {
	const splittedTokens = value.replace(/ /g, '').split(',');
	return splittedTokens.map(parseDateToken);
};
