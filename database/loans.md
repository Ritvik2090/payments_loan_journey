# 🏦 loans

[← Back to Database Overview](./README.md)

---

## What is this table?

The `loans` table is the **central table** of the entire schema.

It represents a single disbursed loan — the moment a lender sends money to a borrower. Every other table (`emis`, `payments`) exists because of a row in this table.

Think of it this way:
- A row in `customers` means someone exists in the system.
- A row in `loans` means that someone was actually given money.

One customer can have multiple loans over their lifetime. Each gets its own row here.

---

## Schema

```sql
CREATE TABLE loans (
    loan_id            VARCHAR(50)    PRIMARY KEY,
    customer_id        VARCHAR(50)    NOT NULL,
    principal_amount   DECIMAL(15,2)  NOT NULL,
    interest_rate      DECIMAL(5,2)   NOT NULL,
    tenure_months      INT            NOT NULL,
    emi_amount         DECIMAL(15,2)  NOT NULL,
    disbursal_date     DATE           NOT NULL,
    completion_date    DATE           NOT NULL,
    loan_status        VARCHAR(10)    NOT NULL DEFAULT 'ACTIVE',
    created_at         TIMESTAMP      NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT chk_loan_status CHECK (loan_status IN ('ACTIVE', 'CLOSED'))
);
```

---

## Column Reference

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `loan_id` | VARCHAR(50) | ❌ | Unique identifier for the loan. Primary key. |
| `customer_id` | VARCHAR(50) | ❌ | The borrower. FK → `customers.customer_id`. |
| `principal_amount` | DECIMAL(15,2) | ❌ | The amount disbursed to the borrower. |
| `interest_rate` | DECIMAL(5,2) | ❌ | Annual interest rate applied to this loan. |
| `tenure_months` | INT | ❌ | Total number of months to repay. |
| `emi_amount` | DECIMAL(15,2) | ❌ | Fixed monthly instalment amount. |
| `disbursal_date` | DATE | ❌ | Date the loan amount was sent to the borrower. |
| `completion_date` | DATE | ❌ | Expected date of the final EMI. |
| `loan_status` | VARCHAR(10) | ❌ | Current state of the loan. `ACTIVE` or `CLOSED`. |
| `created_at` | TIMESTAMP | ❌ | When this loan record was inserted into the DB. |

---

## Column Deep Dive

### `loan_id`
- Unique identifier for every loan in the system.
- Format varies — `LN_00123`, `LOAN-2024-00456`, or a UUID.
- This is the most referenced column across the entire schema — `emis` and `payments` both carry `loan_id` as a foreign key.

### `principal_amount`
- The actual rupee amount disbursed to the borrower.
- This is the starting point for all interest calculations.
- Does NOT include processing fees, GST, or insurance (those are handled separately in real systems).

### `interest_rate`
- Stored as annual percentage. e.g. `18.00` means 18% per annum.
- Monthly rate = `interest_rate / 12 / 100`
- Used to calculate each EMI's interest component in the `emis` table.

### `tenure_months`
- Number of months the loan runs for.
- Determines how many rows exist in `emis` for this loan.
- e.g. tenure = 24 → 24 rows in `emis`.

### `emi_amount`
- Calculated at disbursal using the **reducing balance formula**:

```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)

Where:
  P = principal_amount
  r = monthly interest rate (interest_rate / 12 / 100)
  n = tenure_months
```

- Fixed for the life of the loan (unless restructured — out of scope here).

### `disbursal_date`
- Day 0 of the loan lifecycle.
- The date money left the lender's account.
- All DPD calculations trace back to this date.

### `completion_date`
- The expected date of the last EMI.
- Computed as: `disbursal_date + tenure_months`
- If the customer pays early (foreclosure), actual closure happens before this date. That's detected via queries — not stored as a separate column here.

### `loan_status`
- Only two values: `ACTIVE` or `CLOSED`.
- `ACTIVE` → loan is live, EMIs are being collected.
- `CLOSED` → loan is fully repaid (whether normally, early, or via settlement).
- Everything else — NPA, write-off, foreclosure, delinquency — is **derived from queries** against `emis` and `payments`. Not stored here.

---

## Relationships

```
customers (customer_id)
    │
    └──▶ loans (loan_id)
              │
              ├──▶ emis (loan_id)
              │
              └──▶ payments (loan_id)
```

---

## Sample Data

| loan_id | customer_id | principal_amount | interest_rate | tenure_months | emi_amount | disbursal_date | completion_date | loan_status | created_at |
|---------|-------------|-----------------|---------------|---------------|------------|----------------|-----------------|-------------|------------|
| LN_001 | CUST_001 | 100000.00 | 18.00 | 12 | 9168.00 | 2024-01-05 | 2024-12-05 | ACTIVE | 2024-01-05 10:00:00 |
| LN_002 | CUST_002 | 500000.00 | 14.00 | 24 | 24006.00 | 2024-01-10 | 2025-12-10 | ACTIVE | 2024-01-10 11:30:00 |
| LN_003 | CUST_001 | 50000.00 | 20.00 | 6 | 8878.00 | 2023-06-01 | 2023-11-01 | CLOSED | 2023-06-01 09:00:00 |

> Note: CUST_001 has two loans — one closed, one active. This is perfectly valid.

---

## What companies call this table

| Company Type | Common Table Name |
|-------------|-------------------|
| Banks | `loan_accounts`, `loan_master` |
| NBFCs | `loans`, `loan_details` |
| Fintechs | `loans`, `credit_accounts` |
| Foreign lenders | `facilities`, `credit_facilities` |

---

## Previous / Next
[← customers.md](./customers.md) | [emis.md →](./emis.md)
