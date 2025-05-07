export type NumericValue = `${number}`;
export type NumericRange = `${NumericValue}-${NumericValue}`;

type YYYY = `${number}${number}${number}${number}`;
type MM = `${number}${number}`;
type DD = `${number}${number}`;

export type DateValue = `${DD}.${MM}.${YYYY}`;
export type DateRange = `${DateValue}-${DateValue}`;

export type ReviewFilters = {
	types?: string[];
	genres?: string[];
	tagIds?: number[];
	lengths?: (NumericValue | NumericRange)[];
	years?: (NumericValue | NumericRange)[];

	/** Array of dates in format YYYY-MM-DD */
	createdAt?: (DateValue | DateRange)[];
	updatedAt?: (DateValue | DateRange)[];
};
