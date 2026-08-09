/**
 * Convert dollars to cents (integer).
 * @param dollars - Amount in dollars
 * @returns Amount in cents as integer
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars (string with 2 decimal places).
 * @param cents - Amount in cents as integer
 * @returns Amount in dollars formatted to 2 decimal places
 */
export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Round cents using half-up rounding.
 * @param cents - Amount in cents
 * @returns Rounded amount in cents
 */
export function roundCents(cents: number): number {
  return Math.round(cents);
}
