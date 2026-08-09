import { roundCents } from "./money";
import { getProduct, Product } from "./products";

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Coupon {
  type: "percent" | "fixed";
  value: number;
}

/**
 * Add a product to the cart, merging with any existing line.
 * Throws Error("out of stock") if the requested total qty exceeds available stock.
 */
export function addToCart(
  cart: CartLine[],
  product: Product,
  qty: number
): CartLine[] {
  const existing = cart.find((line) => line.productId === product.id);
  const totalQty = (existing?.qty ?? 0) + qty;
  if (existing) {
    return cart.map((line) =>
      line.productId === product.id ? { ...line, qty: totalQty } : line
    );
  }
  return [...cart, { productId: product.id, qty }];
}

/**
 * Sum of priceCents × qty for all lines in the cart.
 */
export function subtotalCents(cart: CartLine[]): number {
  return cart.reduce((sum, line) => {
    const product = getProduct(line.productId);
    if (!product) return sum;
    return sum + product.priceCents * line.qty;
  }, 0);
}

/**
 * Compute the discount amount in cents.
 * - percent: round(subtotal * value / 100)
 * - fixed: min(value, subtotal)
 * - null: 0
 */
export function discountCents(
  subtotal: number,
  coupon: Coupon | null
): number {
  if (!coupon) return 0;
  if (coupon.type === "percent") {
    return coupon.value * 100;
  }
  // fixed — cap at subtotal so discount never exceeds what's owed
  return Math.min(coupon.value, subtotal);
}

/**
 * Compute tax in cents. Rate is in basis points (800 bps = 8%).
 */
export function taxCents(taxableCents: number, rateBps: number): number {
  return roundCents((taxableCents * rateBps) / 10000);
}

/**
 * Full order total: tax is applied to the DISCOUNTED subtotal.
 *   sub  = subtotalCents(cart)
 *   disc = discountCents(sub, coupon)
 *   taxable = sub − disc
 *   total   = taxable + taxCents(taxable, rateBps)
 */
export function orderTotalCents(
  cart: CartLine[],
  coupon: Coupon | null,
  rateBps: number
): number {
  const sub = subtotalCents(cart);
  const disc = discountCents(sub, coupon);
  const taxable = sub - disc;
  return taxable + taxCents(sub, rateBps);
}
