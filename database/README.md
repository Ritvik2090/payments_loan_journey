# 🗄️ Database — Loan Lifecycle Schema

> This section covers the core database tables that form the backbone of any lending system — whether it's a large public sector bank, a modern NBFC, a BNPL startup, or a foreign lending institution.

---

## Why These Tables?

When a company lends money, three fundamental things happen:

1. **A loan is created** — someone borrows money
2. **A schedule is generated** — defining when and how much they'll repay
3. **Payments come in** — actual money received against that schedule

Every lending company in the world — regardless of size, geography, or tech stack — tracks these three things. The table names may differ, the column names may differ, the database engine may differ. But the underlying data always exists.

This schema captures exactly that — the **universal minimum** required to run and analyse a loan book.

---

## The 4 Core Tables

```
customers
    │
    └──▶ loans
              │
              ├──▶ emis
              │
              └──▶ payments
```

| Table | Real World Meaning | Also called |
|-------|--------------------|-------------|
| [`customers`](./customers.md) | The person who borrowed money | `borrowers`, `users`, `clients` |
| [`loans`](./loans.md) | The loan given to that person | `loan_accounts`, `loan_master`, `accounts` |
| [`emis`](./emis.md) | The repayment schedule — what should be paid and when | `repayment_schedule`, `emi_schedule`, `instalments` |
| [`payments`](./payments.md) | Actual money received — what was paid and when | `transactions`, `repayments`, `receipts` |

---

## How They Relate

```
One customer   →   can have many loans
One loan       →   has many EMIs (one per month, generated at disbursal)
One loan       →   has many payments (each time money comes in)
One EMI        →   can have many payments (if paid in parts)
```

The key column that ties everything together is **`loan_id`**. It lives in `loans`, and is referenced by both `emis` and `payments`. Almost every analytical query you write will join on `loan_id`.

---

## What You Can Derive From These 4 Tables

These tables are intentionally raw. The real intelligence comes from querying them:

| What you want to know | How |
|-----------------------|-----|
| Is this loan overdue? | Compare `emis.due_date` vs `payments.payment_date` |
| How many days past due? | `payment_date - due_date` = DPD |
| Which bucket is this loan in? | DPD range → Bucket 1 / 2 / 3 / NPA |
| What is the outstanding principal? | Last row of `emis.outstanding_principal` |
| Did this EMI get paid on time? | Match `emi_id` in payments, check payment_date vs due_date |
| Total interest collected this month | Sum `payments.interest_paid` for the month |
| Loans with no payment in 90 days | No payment rows in last 90 days |
| Foreclosure detection | `payment_date` < `completion_date` AND loan fully paid |
| Prepayment detection | `total_amount_paid` > `emi_amount` for that period |

> **The philosophy:** store the minimum, derive the maximum.

---

## What Is NOT In This Schema

These things exist at real companies but are intentionally excluded here — they are either sensitive, company-specific, or vary too much to generalise:

| Excluded | Why |
|----------|-----|
| KYC / PAN / Aadhaar | PII — sensitive |
| Credit score pulls | Vendor-specific (CIBIL, Experian, etc.) |
| Collections tables | Highly company-specific workflows |
| Agent / field data | Internal operations |
| Disbural bank details | Sensitive |
| Restructuring / moratorium | Internal policy decisions |
| Loan product config | Too varied across companies |

---

## SQL Environments

These tables work across all major SQL environments:

| Environment | Typically used by |
|-------------|------------------|
| **MySQL** | Small NBFCs, early-stage fintechs |
| **PostgreSQL** | Mid-size fintechs, startups |
| **BigQuery** | Analytics teams, data warehouses |
| **ClickHouse** | High-volume real-time analytics |
| **Redshift** | Large banks on AWS |
| **Snowflake** | Enterprise lenders |

> `FOREIGN KEY` constraints are shown for clarity but are often not enforced in analytical databases like BigQuery and ClickHouse. The relationships exist logically — enforced at the application layer.

---

## Navigate the Schema

| File | Description |
|------|-------------|
| 📄 [customers.md](./customers.md) | Who is borrowing |
| 📄 [loans.md](./loans.md) | The loan itself |
| 📄 [emis.md](./emis.md) | The repayment schedule |
| 📄 [payments.md](./payments.md) | Actual payments received |
