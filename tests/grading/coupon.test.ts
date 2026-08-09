import { expect, test } from "vitest";
import { discountCents } from "@/lib/cart";

test("10% coupon on $200 is $20", () => {
  expect(discountCents(20000, { type: "percent", value: 10 })).toBe(2000);
});

test("25% coupon on $80 is $20", () => {
  expect(discountCents(8000, { type: "percent", value: 25 })).toBe(2000);
});

test("fixed coupon still works", () => {
  expect(discountCents(5000, { type: "fixed", value: 1000 })).toBe(1000);
});
