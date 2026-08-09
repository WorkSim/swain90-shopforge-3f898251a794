import type { CartLine, Coupon } from "@/lib/cart";
import {
  subtotalCents,
  discountCents,
  taxCents,
  orderTotalCents,
} from "@/lib/cart";
import { centsToDollars } from "@/lib/money";

const TAX_RATE_BPS = 800; // 8%

const cart: CartLine[] = [{ productId: "laptop-pro", qty: 1 }];

const coupon: Coupon = { type: "percent", value: 10 };

export default function CartPage() {
  const sub = subtotalCents(cart);
  const disc = discountCents(sub, coupon);
  const taxable = sub - disc;
  const tax = taxCents(taxable, TAX_RATE_BPS);
  const total = orderTotalCents(cart, coupon, TAX_RATE_BPS);

  return (
    <main>
      <h1>Cart</h1>
      <table>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>${centsToDollars(sub)}</td>
          </tr>
          <tr>
            <td>Discount (10%)</td>
            <td>-${centsToDollars(disc)}</td>
          </tr>
          <tr>
            <td>Tax (8%)</td>
            <td>${centsToDollars(tax)}</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>${centsToDollars(total)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
