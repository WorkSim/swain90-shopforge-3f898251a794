export interface Product {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "laptop-pro",
    name: "Pro Laptop",
    priceCents: 20000, // Exactly $200.00 for Task 4 tax test
    stock: 5,
  },
  {
    id: "mouse-wireless",
    name: "Wireless Mouse",
    priceCents: 2500, // $25.00
    stock: 10,
  },
  {
    id: "keyboard-mechanical",
    name: "Mechanical Keyboard",
    priceCents: 8500, // $85.00
    stock: 0, // Out-of-stock product
  },
  {
    id: "monitor-4k",
    name: "4K Monitor",
    priceCents: 35000, // $350.00
    stock: 3,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
