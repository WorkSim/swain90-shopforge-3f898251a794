import { expect, test } from "vitest";
import { addToCart } from "@/lib/cart";
import { PRODUCTS } from "@/lib/products";

test("out-of-stock product cannot be added", () => {
  const oos = PRODUCTS.find((p) => p.stock === 0)!;
  expect(() => addToCart([], oos, 1)).toThrow();
});

test("in-stock product can be added", () => {
  const inStock = PRODUCTS.find((p) => p.stock > 0)!;
  expect(addToCart([], inStock, 1).length).toBe(1);
});
