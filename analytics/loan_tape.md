# 📋 Loan Tape

> One of the most commonly used artefacts in lending analytics — yet rarely explained to people new to the domain.

---

## What is a Loan Tape?

A **Loan Tape** is a snapshot of your entire loan portfolio at a single point in time.

It is a **flat, wide table** — one row per loan — that brings together everything you need to know about each loan's current state: who borrowed, how much, when, what's been paid, what's overdue, and how risky it is right now.

The name comes from the old days when this data was literally exported onto magnetic tape and shared between institutions. The name stuck.

Today a loan tape is usually a CSV, an Excel file, or a table in a data warehouse — but the concept is the same.

---

## Who uses it and why?

| Team | Why they need it |
|------|-----------------|
| **Risk** | To assess portfolio health — how much is overdue, what's at risk of becoming NPA |
| **Collections** | To identify which loans need follow-up and prioritise outreach |
| **Finance** | To calculate provisioning requirements and project losses |
| **Investors / Auditors** | To independently verify the quality of a lender's loan book |
| **Data / Analytics** | To build dashboards, track trends, and run models |

When an NBFC raises funds or gets audited, the first thing an investor or auditor asks for is the loan tape. It is the single source of truth for the health of a lending business.

---

## What a Loan Tape looks like

One row per loan. Each row tells the complete story of that loan as of today.

```
loan_id | customer_id | disbursal_date | principal_amount | tenure_months
| emi_amount | completion_date | total_emis | emis_paid | emis_unpaid
| total_amount_due | total_amount_paid | outstanding_principal
| last_payment_date | dpd | bucket | loan_status
```

---

## Column by Column — How to Read It

### Identity columns
| Column | What it tells you |
|--------|------------------|
| `loan_id` | Which loan this row is about |
| `customer_id` | Who the borrower is |

### Loan setup columns
| Column | What it tells you |
|--------|------------------|
| `disbursal_date` | When the money was given |
| `principal_amount` | How much was lent |
| `interest_rate` | At what rate |
| `tenure_months` | For how long |
| `emi_amount` | How much per month |
| `completion_date` | When it should end |

### Progress columns
| Column | What it tells you |
|--------|------------------|
| `total_emis` | Total instalments in the schedule |
| `emis_paid` | How many have been fully paid |
| `emis_unpaid` | How many are still pending |
| `total_amount_due` | Sum of all EMIs that should have been paid by today |
| `total_amount_paid` | Sum of all actual payments received till today |
| `outstanding_principal` | How much principal is still left to be repaid |

### Health columns
| Column | What it tells you |
|--------|------------------|
| `last_payment_date` | The most recent date any payment came in |
| `dpd` | Days Past Due — how many days overdue is the oldest unpaid EMI |
| `bucket` | Delinquency bucket based on DPD |
| `loan_status` | `ACTIVE` or `CLOSED` |

---

## The DPD and Bucket columns — the most important ones

DPD and bucket are the two columns everyone looks at first.

**DPD (Days Past Due)** tells you how late the borrower is on their oldest unpaid EMI:

```
DPD = Today's date − Due date of oldest unpaid EMI

If no EMI is overdue → DPD = 0
```

**Bucket** is just a label on top of DPD:

| DPD Range | Bucket | What it means |
|-----------|--------|---------------|
| 0 | X (Current) | All good, no overdue |
| 1 – 30 | Bucket 1 | Early delinquency |
| 31 – 60 | Bucket 2 | Moderate risk |
| 61 – 90 | Bucket 3 | High risk |
| 90+ | NPA | Non-Performing Asset |

A healthy portfolio has most of its loans in Bucket X. As loans move into Bucket 1, 2, 3 — the risk and provisioning requirement increases.

---

## Loan Tape vs Individual Tables

You might ask — why not just query `loans`, `emis`, and `payments` directly?

You can. But a loan tape is a **pre-aggregated, ready-to-use view** of all that data. Instead of writing complex joins every time, teams generate the loan tape once (daily, weekly, or monthly) and use it for all reporting.

Think of it as a materialised view of the entire loan book.

```
loans + emis + payments
         ↓
    (aggregation query)
         ↓
      loan tape
         ↓
   risk / collections / finance teams
```

---

## How a Loan Tape is generated

It is built by joining all three core tables and aggregating:

```sql
SELECT
    l.loan_id,
    l.customer_id,
    l.disbursal_date,
    l.principal_amount,
    l.interest_rate,
    l.tenure_months,
    l.emi_amount,
    l.completion_date,
    l.loan_status,

    -- Progress
    COUNT(e.emi_id)                                        AS total_emis,
    COUNT(CASE WHEN e.emi_status = 'PAID' THEN 1 END)     AS emis_paid,
    COUNT(CASE WHEN e.emi_status = 'UNPAID' THEN 1 END)   AS emis_unpaid,

    -- Amounts
    SUM(CASE WHEN e.due_date <= CURRENT_DATE
             THEN e.emi_amount ELSE 0 END)                 AS total_amount_due,
    COALESCE(SUM(p.total_amount_paid), 0)                  AS total_amount_paid,

    -- Outstanding
    MIN(CASE WHEN e.emi_status = 'UNPAID'
             THEN e.outstanding_principal END)              AS outstanding_principal,

    -- Last payment
    MAX(p.payment_date)                                    AS last_payment_date,

    -- DPD
    GREATEST(
        CURRENT_DATE - MIN(
            CASE WHEN e.emi_status = 'UNPAID'
                 AND e.due_date < CURRENT_DATE
                 THEN e.due_date END
        ), 0
    )                                                      AS dpd,

    -- Bucket
    CASE
        WHEN GREATEST(CURRENT_DATE - MIN(
            CASE WHEN e.emi_status = 'UNPAID'
                 AND e.due_date < CURRENT_DATE
                 THEN e.due_date END), 0) = 0        THEN 'X'
        WHEN GREATEST(CURRENT_DATE - MIN(
            CASE WHEN e.emi_status = 'UNPAID'
                 AND e.due_date < CURRENT_DATE
                 THEN e.due_date END), 0) <= 30      THEN 'Bucket 1'
        WHEN GREATEST(CURRENT_DATE - MIN(
            CASE WHEN e.emi_status = 'UNPAID'
                 AND e.due_date < CURRENT_DATE
                 THEN e.due_date END), 0) <= 60      THEN 'Bucket 2'
        WHEN GREATEST(CURRENT_DATE - MIN(
            CASE WHEN e.emi_status = 'UNPAID'
                 AND e.due_date < CURRENT_DATE
                 THEN e.due_date END), 0) <= 90      THEN 'Bucket 3'
        ELSE 'NPA'
    END                                                    AS bucket

FROM loans l
LEFT JOIN emis e    ON l.loan_id = e.loan_id
LEFT JOIN payments p ON l.loan_id = p.loan_id
WHERE l.loan_status = 'ACTIVE'
GROUP BY
    l.loan_id, l.customer_id, l.disbursal_date, l.principal_amount,
    l.interest_rate, l.tenure_months, l.emi_amount,
    l.completion_date, l.loan_status;
```

---

## Sample Loan Tape Output

| loan_id | customer_id | principal_amount | tenure_months | emis_paid | emis_unpaid | outstanding_principal | last_payment_date | dpd | bucket |
|---------|-------------|-----------------|---------------|-----------|-------------|----------------------|-------------------|-----|--------|
| LN_001 | CUST_001 | 100000.00 | 12 | 8 | 4 | 38200.00 | 2024-09-05 | 0 | X |
| LN_002 | CUST_002 | 500000.00 | 24 | 5 | 19 | 410000.00 | 2024-07-10 | 62 | Bucket 3 |
| LN_003 | CUST_003 | 200000.00 | 18 | 3 | 15 | 165000.00 | 2024-08-22 | 15 | Bucket 1 |
| LN_004 | CUST_004 | 75000.00 | 6 | 2 | 4 | 52000.00 | 2024-06-01 | 95 | NPA |

Reading this table:
- `LN_001` → healthy, 8 EMIs paid, 0 DPD, all good ✅
- `LN_002` → serious risk, 62 DPD, in Bucket 3, close to NPA ⚠️
- `LN_003` → early delinquency, 15 DPD, needs follow-up 🟡
- `LN_004` → NPA, 95 DPD, collections / legal process likely initiated 🔴

---

## Key things to remember

- A loan tape is always **as of a specific date** — it is a snapshot, not a live view. Always check the date it was generated.
- DPD can go to 0 and come back up — a loan can be delinquent, get paid, and become current again. This is called a **cure**.
- A loan tape only shows the current state. For historical movement between buckets over time, you need a **vintage analysis** or **roll rate analysis** — which uses multiple loan tapes across dates.
- When shared externally (investors, auditors), the loan tape usually excludes PII columns like customer name, phone, PAN.

---

## Where this file fits in the repo

```
payments_loan_journey/
├── README.md
├── glossary/
├── database/
└── analytics/
    └── loan_tape.md        ← you are here
```

---

[← Back to Analytics Overview](./)
