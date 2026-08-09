import { PRODUCTS } from "@/lib/products";
import { centsToDollars } from "@/lib/money";

export default function ProductsPage() {
  return (
    <main>
      <h1>ShopForge</h1>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <span> — ${centsToDollars(product.priceCents)}</span>
            {product.stock === 0 && <span> [Out of stock]</span>}
          </li>
        ))}
      </ul>
    </main>
  );
}
