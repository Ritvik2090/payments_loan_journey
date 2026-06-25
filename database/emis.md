# 📅 emis

[← Back to Database Overview](./README.md)

---

## What is this table?

The `emis` table represents the **repayment schedule** — a pre-generated list of all instalments a borrower is expected to pay over the life of the loan.

When a loan is disbursed, the system immediately generates N rows in this table — one for each month of the tenure. If the loan is for 24 months, 24 rows are created on day 1.

This table answers the question: **"What should have been paid, and when?"**

Compare it with `payments` which answers: **"What was actually paid, and when?"**

The gap between these two tables is where all the analytics lives — DPD, delinquency, NPA, collections.

---

## Schema

```sql
CREATE TABLE emis (
    emi_id                 VARCHAR(50)    PRIMARY KEY,
    loan_id                VARCHAR(50)    NOT NULL,
    emi_number             INT            NOT NULL,
    due_date               DATE           NOT NULL,
    emi_amount             DECIMAL(15,2)  NOT NULL,
    principal_component    DECIMAL(15,2)  NOT NULL,
    interest_component     DECIMAL(15,2)  NOT NULL,
    outstanding_principal  DECIMAL(15,2)  NOT NULL,
    emi_status             VARCHAR(10)    NOT NULL DEFAULT 'UNPAID',
    created_at             TIMESTAMP      NOT NULL,

    FOREIGN KEY (loan_id) REFERENCES loans(loan_id),
    CONSTRAINT chk_emi_status CHECK (emi_status IN ('PAID', 'UNPAID')),
    CONSTRAINT chk_emi_amount CHECK (
        ROUND(principal_component + interest_component, 2) = ROUND(emi_amount, 2)
    )
);
```

---

## Column Reference

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `emi_id` | VARCHAR(50) | ❌ | Unique identifier for this EMI row. |
| `loan_id` | VARCHAR(50) | ❌ | Which loan this EMI belongs to. FK → `loans.loan_id`. |
| `emi_number` | INT | ❌ | Sequence number. 1 = first instalment, N = last. |
| `due_date` | DATE | ❌ | Date by which this EMI must be paid. |
| `emi_amount` | DECIMAL(15,2) | ❌ | Total amount due = principal + interest. |
| `principal_component` | DECIMAL(15,2) | ❌ | How much of this EMI reduces the principal. |
| `interest_component` | DECIMAL(15,2) | ❌ | How much of this EMI is interest cost. |
| `outstanding_principal` | DECIMAL(15,2) | ❌ | Remaining principal after this EMI is paid. |
| `emi_status` | VARCHAR(10) | ❌ | `PAID` or `UNPAID`. |
| `created_at` | TIMESTAMP | ❌ | When this EMI row was generated. |

---

## Column Deep Dive

### `emi_number`
- Sequence counter starting at 1.
- EMI 1 is the first payment due, EMI N (where N = tenure_months) is the last.
- Used to order the repayment schedule and track progress.
- e.g. for a 24-month loan, `emi_number` runs from 1 to 24.

### `due_date`
- The contractual deadline for this EMI.
- Typically: `disbursal_date + emi_number months`
- e.g. loan disbursed 5th Jan → EMI 1 due 5th Feb → EMI 2 due 5th Mar → and so on.
- This is the anchor for all DPD calculations:
```
DPD = payment_date - due_date   (if payment_date > due_date)
DPD = 0                          (if paid on time or early)
```

### `principal_component` and `interest_component`
- Every EMI is split into two parts under the **reducing balance method**.
- Interest is charged on the **outstanding principal**, which reduces every month.
- So as EMI number increases: principal component ↑ and interest component ↓.
- The total `emi_amount` stays fixed throughout.

```
EMI 1:  Principal ₹6,500  | Interest ₹1,500  | Outstanding ₹93,500
EMI 2:  Principal ₹6,598  | Interest ₹1,403  | Outstanding ₹86,902
EMI 3:  Principal ₹6,697  | Interest ₹1,304  | Outstanding ₹80,205
...
EMI N:  Principal ₹7,887  | Interest ₹118    | Outstanding ₹0.00
```

- Always true: `principal_component + interest_component = emi_amount`

### `outstanding_principal`
- The remaining principal balance **after** this EMI is paid.
- EMI 1: `principal_amount - principal_component of EMI 1`
- Last EMI: `0.00`
- This column is pre-calculated and stored — useful for quick lookups without recalculating the full amortisation schedule.

### `emi_status`
- `UNPAID` → this instalment has not been fully paid yet (default state).
- `PAID` → this instalment has been fully cleared.
- Kept deliberately simple — overdue detection, partial payment tracking, DPD — all come from **joining with `payments`**, not from adding more statuses here.

---

## How the schedule is generated

At the time of loan disbursal, the system runs an amortisation calculation and inserts all N rows at once:

```sql
-- Pseudocode for schedule generation
FOR emi_number IN 1 TO tenure_months:
    interest_component    = outstanding_principal × monthly_rate
    principal_component   = emi_amount - interest_component
    outstanding_principal = outstanding_principal - principal_component
    due_date              = disbursal_date + emi_number months

    INSERT INTO emis (loan_id, emi_number, due_date, emi_amount,
                      principal_component, interest_component,
                      outstanding_principal, emi_status, created_at)
    VALUES (...)
```

---

## Relationships

```
loans (loan_id)
    │
    └──▶ emis (emi_id, loan_id)
              │
              └──▶ payments (emi_id)   -- payments made against this EMI
```

---

## Sample Data

For loan `LN_001` — ₹1,00,000 at 18% for 12 months, EMI = ₹9,168

| emi_id | loan_id | emi_number | due_date | emi_amount | principal_component | interest_component | outstanding_principal | emi_status |
|--------|---------|------------|----------|------------|--------------------|--------------------|----------------------|------------|
| EMI_001 | LN_001 | 1 | 2024-02-05 | 9168.00 | 7668.00 | 1500.00 | 92332.00 | PAID |
| EMI_002 | LN_001 | 2 | 2024-03-05 | 9168.00 | 7783.00 | 1385.00 | 84549.00 | PAID |
| EMI_003 | LN_001 | 3 | 2024-04-05 | 9168.00 | 7900.00 | 1268.00 | 76649.00 | UNPAID |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| EMI_012 | LN_001 | 12 | 2024-12-05 | 9168.00 | 9032.00 | 136.00 | 0.00 | UNPAID |

---

## Key queries enabled by this table

**What is the current outstanding principal on a loan?**
```sql
SELECT outstanding_principal
FROM emis
WHERE loan_id = 'LN_001'
  AND emi_status = 'UNPAID'
ORDER BY emi_number ASC
LIMIT 1;
```

**How many EMIs are pending for a loan?**
```sql
SELECT COUNT(*)
FROM emis
WHERE loan_id = 'LN_001'
  AND emi_status = 'UNPAID';
```

**Which loans have unpaid EMIs past their due date?**
```sql
SELECT loan_id, emi_id, due_date, CURRENT_DATE - due_date AS dpd
FROM emis
WHERE emi_status = 'UNPAID'
  AND due_date < CURRENT_DATE
ORDER BY dpd DESC;
```

---

## What companies call this table

| Company Type | Common Table Name |
|-------------|-------------------|
| Banks | `repayment_schedule`, `emi_master` |
| NBFCs | `emis`, `emi_schedule` |
| Fintechs | `instalments`, `repayment_plan` |
| Foreign lenders | `amortisation_schedule`, `payment_schedule` |

---

## Previous / Next
[← loans.md](./loans.md) | [payments.md →](./payments.md)
