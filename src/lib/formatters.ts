/**
 * Formats a price
 * @param value The price to be formatted
 * @param options Additional custom `NumberFormat` options
 * @returns The formatted price
 */
export const formatPrice = (
	value: number,
	options?: Intl.NumberFormatOptions,
) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		...options,
	}).format(value);

/**
 * The coin to be formatted
 */
interface FormatCoin {
	/**
	 * The coin's denom (aka symbol)
	 */
	denom?: string;
	/**
	 * The numerical amount
	 */
	amount: number;
}

/**
 * Formats a coin amount with its denom
 * @param param0 An object containing the coin denom and the amount to be formatted
 * @param options Additional custom `NumberFormat` options
 * @returns The formatted amount
 */
export const formatCoin = (
	{ denom, amount }: FormatCoin,
	options?: Intl.NumberFormatOptions,
) => `${new Intl.NumberFormat("en-US", options).format(amount)} ${denom}`;

/**
 * Formats a rate
 * @param value The value to be formatted, has to be in range from 0 to 1
 * @param options Additional custom `NumberFormat` options
 * @returns The formatted rate
 */
export const formatRate = (value: number, options?: Intl.NumberFormatOptions) =>
	new Intl.NumberFormat("en-US", { style: "percent", ...options }).format(
		value,
	);
