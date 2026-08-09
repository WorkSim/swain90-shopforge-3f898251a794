# ShopForge

ShopForge is a minimal Next.js e-commerce application used as a **debugging sandbox** within the WorkSim platform. It demonstrates core e-commerce functionality (product catalog, shopping cart, checkout with tax and discounts) with intentional, documented bugs planted for candidate learning and assessment.

## Overview

**What it is:** A lightweight Next.js app with:
- Product catalog with pricing and stock tracking
- Shopping cart with coupon/discount support
- Tax calculation
- Intentional seeded bugs (via patches) that candidates must fix

**What it's for:** WorkSim uses ShopForge to test problem-solving skills across real e-commerce workflows — applying coupons, validating inventory, calculating tax correctly.

**Key constraint:** This is a standalone template repo. `main` here is the correct, unmodified baseline implementation. At provision time, the platform plants every bug in the sprint into a student's own copy of the repo's root commit — so while this template's `main` stays clean, a student's `main` carries all of the sprint's known defects from the start. The assigned ticket names the one in scope; unrelated failures are other tickets' bugs, not something to fix.

## Quick Start

### Prerequisites
- Node.js 24+
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Run all tests (visible + grading)
npm test

# Run only grading tests (authoritative test suite)
npm run test:grading

# Build for production
npm run build
```

## Project Structure

```
shopforge/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Product listing page
│   │   └── cart/page.tsx       # Shopping cart page
│   └── lib/
│       ├── products.ts         # Product catalog & data
│       ├── cart.ts             # Cart logic (addToCart, discount, tax)
│       ├── money.ts            # Monetary helpers (rounding, conversions)
│       └── _smoke.ts           # Smoke test data
├── tests/
│   ├── visible/                # VISIBLE tests (develop against these)
│   │   ├── _smoke.test.ts      # Basic app smoke test
│   │   └── cart.test.ts        # Cart functionality tests
│   └── grading/                # GRADING tests (restored from baseline in CI)
│       ├── coupon.test.ts      # Discount/coupon tests
│       ├── stock.test.ts       # Inventory validation tests
│       └── tax.test.ts         # Sales tax calculation tests
├── .github/workflows/
│   └── grade.yml               # CI grading workflow
├── package.json
├── tsconfig.json
├── next.config.ts
└── vitest.config.ts
```

## Testing Strategy

ShopForge uses a **two-tier test split** for learning and assessment:

### Visible Tests (`tests/visible/`)
- **Purpose:** For candidates to develop and validate their fixes
- **Run:** `npm test` (includes both visible + grading)
- **Edit:** ✅ Safe to edit and experiment with
- **Example:** Smoke tests, basic cart operations

### Grading Tests (`tests/grading/`)
- **Purpose:** Authoritative test suite for final assessment
- **Run:** `npm run test:grading` or included in full test run
- **Edit:** ⚠️ Do not edit — these are restored from the baseline in CI
- **Coverage:** Tests for each of the 3 seeded bugs
  - `coupon.test.ts` — Discount calculations
  - `stock.test.ts` — Inventory validation
  - `tax.test.ts` — Sales tax on discounted amounts

**Important:** This template repo's own `main` is the correct baseline. A student's provisioned repo ships with the sprint's known defects already committed to `main`; the assigned ticket names the one in scope. Running `npm test` in a student's repo may show unrelated failures — those are other tickets' bugs, not something to fix.

## CI Grading Workflow

The `.github/workflows/grade.yml` workflow runs on every pull request targeting `main`:

1. Checks out the PR's merge ref (candidate code + grading baseline merged)
2. Restores `tests/grading`, `package.json`, `vitest.config.ts`, and `.github/grading-map.json` from the base branch — so a PR cannot fake a pass by editing those files
3. **Scopes the run to the ticket the PR is for**, then installs with `npm ci` and runs `npm run test:grading`

### Why scoping matters

Every one of the sprint's bugs is planted in your repo's root commit from day one. An
unscoped run therefore fails on the tickets you have not been assigned yet, so a
perfectly correct day-1 PR would show a red check. That is noise, not signal.

The workflow finds the ticket id in your **branch name**, then the **PR title**, then the
**PR body** — first match wins — and removes the other tickets' grading files before
running. Name your branch after the ticket and the check grades only your work:

```
git checkout -b ecom-114-short-description
```

If no ticket id is found anywhere, the workflow runs everything and says so in the job
summary rather than pretending the result is meaningful.

**Threat model (accurate):** Restoring grading tests and config from the base branch prevents a candidate PR from altering what gets tested or how, and the ticket is read from env vars rather than interpolated into the script, so a crafted PR title cannot execute code. However, because GitHub runs the workflow file from the PR's merge ref, a collaborator with write access could still alter `grade.yml` itself — and scoping is by definition self-declared, so a PR can point the check at a ticket it did not fix. For both reasons, **WorkSim grades authoritatively out-of-band and does not solely trust the in-repo check**.

## Publishing as a Template Repo

To publish ShopForge as a standalone GitHub template (e.g., `worksim/shopforge-template`):

### Checklist

- [ ] **Create repo:** Create new public repo `worksim/shopforge-template` on GitHub
- [ ] **Push contents:** Push the _contents_ of `templates/shopforge/` to the new repo root
  ```bash
  # From the new repo root:
  git init
  git add -A
  git commit -m "Initial ShopForge template"
  git branch -M main
  git remote add origin https://github.com/worksim/shopforge-template.git
  git push -u origin main
  ```
- [ ] **Mark as template:** In GitHub repo settings → "Template repository" → check ✓
- [ ] **Verify workflow:** Confirm `.github/workflows/grade.yml` is present and readable
- [ ] **Check baseline:** Ensure `main` is clean (no uncommitted patches) and all tests pass
- [ ] **Test:** Use "Use this template" → create a test instance and run `npm test` (16 pass)

### Important Notes on Patches

- **Patches are never committed to this template repo's own `main`.** They are resolved and planted by the platform's provisioning step directly into a student's own copy of the repo, as that repo's single root commit — not applied by a runtime script that leaves `main` untouched, and not one at a time as tickets are started.
- **In this template repo, `main` always represents the correct baseline** where all tests pass. A student's own copy of the repo has every sprint defect already committed to `main` from the moment it's provisioned — this template's clean `main` is the baseline that copy started from, not a guarantee about the student's repo.
- Every ticket's bug is present in a student's `main` from provisioning onward, not introduced when that ticket is started; each ticket names the one bug in scope, and candidates fix it.
- CI restores `tests/grading`, `package.json`, and `vitest.config.ts` from the base branch before grading, so a candidate PR can't fake a pass by editing those files — it does not remove the sprint's defects, which are expected to be present on `main`.

## Development Tips

### Running the App
```bash
npm run dev
```
Open http://localhost:3000 → browse products → add to cart → proceed to checkout.

### Understanding the Cart Logic
All shopping cart operations are in `src/lib/cart.ts`:
- `addToCart()` — Add items (validates stock)
- `subtotalCents()` — Sum of `priceCents × qty` for all cart lines
- `discountCents()` — Compute discount amount in cents (percent or fixed coupon)
- `taxCents()` — Compute tax in cents given a rate in basis points
- `orderTotalCents()` — Full order total: `subtotal − discount + tax(discounted amount)`

Money is stored in **cents** (integers) throughout. Helpers in `src/lib/money.ts` handle conversions.

### Running Tests Locally
```bash
# All tests (visible + grading)
npm test

# Watch mode
npm test -- --watch

# Run only coupon tests
npm test coupon

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

**Q: Tests fail on `main`?**  
A: Expected. Your repo ships with the sprint's known defects; your ticket names the one in scope. Unrelated failures are other tickets' bugs, not something to revert.

**Q: Grading tests are passing but I expected them to fail?**  
A: All the sprint's known defects are already committed on `main` when your repo is provisioned; this template's own `main` is the correct baseline. Your ticket names the one in scope for grading.

**Q: Can I edit the grading tests?**  
A: Not in the template. CI always restores them from the baseline. Edits in your fork are local only; the authoritative grading happens against the restored tests.

**Q: Which test file should I focus on?**  
A: Start with `tests/visible/cart.test.ts` to understand how the cart works. The grading tests are more specific to each bug.

## Environment Variables

ShopForge uses no external APIs or environment variables. All data is hard-coded for determinism (see `src/lib/products.ts` for the catalog).

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vitest Docs:** https://vitest.dev
- **React Docs:** https://react.dev

---

**Last Updated:** 2026-06-27  
**Maintained By:** WorkSim Team
