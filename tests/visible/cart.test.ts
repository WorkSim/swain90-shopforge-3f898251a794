import { expect, test } from "vitest";
import { centsToDollars, dollarsToCents } from "@/lib/money";
import { getProduct, PRODUCTS } from "@/lib/products";
import {
  addToCart,
  discountCents,
  orderTotalCents,
  subtotalCents,
  taxCents,
} from "@/lib/cart";

// ── money / catalog (from Task 2) ──────────────────────────────────────────

test("money conversions", () => {
  expect(dollarsToCents(200)).toBe(20000);
  expect(centsToDollars(2000)).toBe("20.00");
});

test("catalog has products incl. an out-of-stock one", () => {
  expect(PRODUCTS.length).toBeGreaterThan(0);
  expect(PRODUCTS.some((p) => p.stock === 0)).toBe(true);
  expect(getProduct(PRODUCTS[0].id)?.name).toBeTruthy();
});

// ── cart / checkout (Task 3) ───────────────────────────────────────────────

test("addToCart rejects out-of-stock", () => {
  const oos = PRODUCTS.find((p) => p.stock === 0)!;
  expect(() => addToCart([], oos, 1)).toThrow("out of stock");
});

test("addToCart merges existing line and checks total qty against stock", () => {
  // laptop-pro has stock: 5; adding 3 then 3 more should throw
  const p = PRODUCTS.find((p) => p.id === "laptop-pro")!;
  const cart = addToCart([], p, 3);
  expect(cart[0].qty).toBe(3);
  expect(() => addToCart(cart, p, 3)).toThrow("out of stock");
});

test("subtotalCents sums lines correctly", () => {
  const p = PRODUCTS.find((p) => p.id === "laptop-pro")!; // 20000 cents
  const cart = addToCart([], p, 2);
  expect(subtotalCents(cart)).toBe(40000);
});

test("percent coupon is a percentage of subtotal", () => {
  expect(discountCents(20000, { type: "percent", value: 10 })).toBe(2000); // $20 off $200
});

test("fixed coupon caps at subtotal", () => {
  expect(discountCents(1500, { type: "fixed", value: 2000 })).toBe(1500);
});

test("null coupon yields zero discount", () => {
  expect(discountCents(20000, null)).toBe(0);
});

test("tax is computed on the discounted subtotal", () => {
  // laptop-pro: $200 (20000 ¢) — exactly the product seeded for this assertion
  // 10% coupon → $20 off → $180 taxable; 8% tax (800 bps) → $14.40 → total $194.40
  const laptopPro = PRODUCTS.find((p) => p.id === "laptop-pro")!;
  const total = orderTotalCents(
    [{ productId: laptopPro.id, qty: 1 }],
    { type: "percent", value: 10 },
    800
  );
  expect(total).toBe(19440); // 18000 taxable + 1440 tax

  // also verify taxCents in isolation
  expect(taxCents(18000, 800)).toBe(1440);
});
