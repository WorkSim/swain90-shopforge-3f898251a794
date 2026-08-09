import { expect, test } from "vitest";
import { orderTotalCents } from "@/lib/cart";
import { PRODUCTS } from "@/lib/products";

// Build a deterministic $200 in-stock cart (pick/define product priced 20000).
test("tax is charged on the discounted subtotal", () => {
  const p = PRODUCTS.find((x) => x.priceCents === 20000 && x.stock > 0)!;
  const total = orderTotalCents(
    [{ productId: p.id, qty: 1 }],
    { type: "percent", value: 10 },
    800
  );
  expect(total).toBe(19440); // 180 taxable + 14.40 tax
});
