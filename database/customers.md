# 👤 customers

[← Back to Database Overview](./README.md)

---

## What is this table?

The `customers` table represents the **borrower** — the person or entity that has taken a loan.

Every loan must belong to someone. This table is that someone. It is the starting point of the entire loan lifecycle — before a loan can be created, a customer record must exist.

In real companies this table holds a lot more — KYC details, PAN, Aadhaar, income info, address. None of that is included here intentionally. This is the **safe, universal minimum**.

---

## Schema

```sql
CREATE TABLE customers (
    customer_id   VARCHAR(50)   PRIMARY KEY,
    created_at    TIMESTAMP     NOT NULL
);
```

---

## Column Reference

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `customer_id` | VARCHAR(50) | ❌ | Unique identifier for each customer. Primary key. |
| `created_at` | TIMESTAMP | ❌ | Timestamp when the customer was onboarded into the system. |

---

## Column Deep Dive

### `customer_id`
- The unique identifier for a customer across the entire system.
- All their loans will reference this ID via `loans.customer_id`.
- Format varies by company — some use auto-incrementing integers (`1001`, `1002`), others use UUIDs (`uuid-xxxx-xxxx`), others use prefixed IDs (`CUST_00123`).
- Once assigned, this ID never changes — it follows the customer forever.

### `created_at`
- The moment the customer record was first created in the system.
- Useful for cohort analysis — grouping customers by when they joined.
- Different from the loan's `disbursal_date` — a customer may be onboarded days or weeks before their first loan is disbursed.

---

## Relationships

```
customers (customer_id)
    │
    └──▶ loans (customer_id)   -- One customer can have many loans
```

- One customer can have **multiple loans** over time.
- Each loan in the `loans` table has a `customer_id` column pointing back here.

---

## Sample Data

| customer_id | created_at |
|-------------|------------|
| CUST_001 | 2024-01-01 09:00:00 |
| CUST_002 | 2024-01-03 11:30:00 |
| CUST_003 | 2024-01-05 14:15:00 |

---

## What companies call this table

| Company Type | Common Table Name |
|-------------|-------------------|
| Banks | `customers`, `borrowers` |
| NBFCs | `customers`, `clients` |
| Fintechs / BNPL | `users`, `borrowers` |
| Foreign lenders | `obligors`, `counterparties` |

---

## Next →
[loans.md](./loans.md) — The loan created for this customer
