# 📈 Metrics & KPIs — Lending Analytics

> The numbers that define whether a lending business is healthy or not.
> These metrics are tracked daily, reported weekly, and reviewed monthly by risk, finance, and leadership teams across every bank, NBFC, and fintech.

---

## Why Metrics Matter

Raw tables tell you what happened. Metrics tell you what it means.

A loan tape gives you 10,000 rows. Metrics collapse those 10,000 rows into a handful of numbers that answer the real questions:

- Is our portfolio getting riskier?
- Are borrowers paying on time?
- How much money are we likely to lose?
- Is our collections team doing their job?
- Should we slow down disbursals?

This file covers the metrics that are truly universal — tracked in some form at every lending institution in the world.

---

## Table of Contents

1. [PAR — Portfolio at Risk](#1-par--portfolio-at-risk)
2. [NPA Ratio](#2-npa-ratio)
3. [OTR — On Time Rate](#3-otr--on-time-rate)
4. [Collection Efficiency](#4-collection-efficiency)
5. [Delinquency Rate](#5-delinquency-rate)
6. [Roll Rate](#6-roll-rate)
7. [Cure Rate](#7-cure-rate)
8. [Bounce Rate](#8-bounce-rate)
9. [How These Metrics Connect](#how-these-metrics-connect)

---

## 1. PAR — Portfolio at Risk

### What is it?
PAR measures what percentage of your total outstanding loan value is at risk — meaning overdue beyond a certain number of days.

The most common variant is **PAR 30** — the percentage of outstanding principal where the loan is 30+ DPD.

### Formula
```
PAR 30 = Outstanding principal of loans with DPD ≥ 30
         ────────────────────────────────────────────── × 100
              Total outstanding principal of all loans
```

### Variants
| Metric | DPD Threshold | What it signals |
|--------|--------------|-----------------|
| PAR 0 | 1+ DPD | Any overdue at all — very sensitive |
| PAR 30 | 30+ DPD | Standard early risk signal |
| PAR 60 | 60+ DPD | Moderate risk |
| PAR 90 | 90+ DPD | Equivalent to NPA threshold |

### Example
```
Total outstanding principal         = ₹10,00,00,000
Outstanding principal at 30+ DPD    = ₹80,00,000

PAR 30 = 80,00,000 / 10,00,00,000 × 100 = 8%
```
A PAR 30 of 8% means 8% of the money you've lent out is at moderate risk of not being repaid on time.

### What's a good number?
- PAR 30 below **3–5%** is generally considered healthy for most NBFCs.
- Above 10% starts raising red flags for investors and regulators.
- The threshold varies by loan product — unsecured personal loans tolerate higher PAR than home loans.

### SQL
```sql
SELECT
    SUM(CASE WHEN dpd >= 30 THEN outstanding_principal ELSE 0 END) /
    SUM(outstanding_principal) * 100 AS par_30
FROM loan_tape
WHERE loan_status = 'ACTIVE';
```

---

## 2. NPA Ratio

### What is it?
The percentage of the total loan portfolio that has been classified as Non-Performing — i.e., overdue for 90+ days.

Mandated to be calculated and reported by RBI for all banks and NBFCs.

### Formula
```
Gross NPA Ratio = Total outstanding principal of NPA loans
                  ──────────────────────────────────────── × 100
                      Total outstanding principal of all loans
```

### Gross NPA vs Net NPA
| Metric | Formula | What it shows |
|--------|---------|--------------|
| **Gross NPA Ratio** | NPA principal / Total principal | Raw exposure |
| **Net NPA Ratio** | (NPA principal − Provisions) / Total principal | Actual risk after accounting for set-aside funds |

### Example
```
Total outstanding principal     = ₹10,00,00,000
NPA outstanding principal       = ₹50,00,000
Provisions set aside            = ₹20,00,000

Gross NPA Ratio = 50,00,000 / 10,00,00,000 × 100  = 5%
Net NPA Ratio   = (50,00,000 − 20,00,000) / 10,00,00,000 × 100 = 3%
```

### SQL
```sql
SELECT
    SUM(CASE WHEN bucket = 'NPA' THEN outstanding_principal ELSE 0 END) /
    SUM(outstanding_principal) * 100 AS gross_npa_ratio
FROM loan_tape
WHERE loan_status = 'ACTIVE';
```

---

## 3. OTR — On Time Rate

### What is it?
The percentage of EMIs that were paid on or before their due date. Measures borrower repayment discipline at the instalment level.

Also called **On Time Payment Rate (OTPR)** or **Repayment Rate** at some companies.

### Formula
```
OTR = Number of EMIs paid on or before due date
      ─────────────────────────────────────────── × 100
              Total EMIs that were due
```

### Example
```
Total EMIs due this month     = 5,000
EMIs paid on or before due date = 4,200

OTR = 4,200 / 5,000 × 100 = 84%
```

### What's a good number?
- OTR above **85–90%** is considered healthy.
- A falling OTR month-on-month is an early warning signal — before DPD and PAR even start moving.
- OTR is often the first metric to deteriorate when economic stress hits borrowers.

### SQL
```sql
SELECT
    COUNT(CASE WHEN p.payment_date <= e.due_date THEN 1 END) /
    COUNT(*) * 100 AS otr
FROM emis e
LEFT JOIN payments p ON e.emi_id = p.emi_id
WHERE e.due_date <= CURRENT_DATE;
```

---

## 4. Collection Efficiency

### What is it?
The percentage of the total amount due (for the month) that was actually collected. Measures how effective the collections operation is.

### Formula
```
Collection Efficiency = Total amount collected in the period
                        ───────────────────────────────────── × 100
                           Total amount due in the period
```

### Variants
| Variant | What's included in "amount due" |
|---------|---------------------------------|
| **Current CE** | Only current month's EMIs |
| **Overall CE** | Current + all previous overdue amounts |
| **Overdue CE** | Only previously overdue amounts (arrears) |

Overall CE is the strictest and most widely used by investors.

### Example
```
Total amount due in October     = ₹1,00,00,000
Total amount collected in October = ₹92,00,000

Collection Efficiency = 92,00,000 / 1,00,00,000 × 100 = 92%
```

### What's a good number?
- Above **95%** is excellent.
- **90–95%** is acceptable.
- Below **85%** is a serious concern.

### SQL
```sql
SELECT
    SUM(p.total_amount_paid) /
    SUM(e.emi_amount) * 100 AS collection_efficiency
FROM emis e
LEFT JOIN payments p ON e.emi_id = p.emi_id
WHERE e.due_date BETWEEN '2024-10-01' AND '2024-10-31';
```

---

## 5. Delinquency Rate

### What is it?
The percentage of **loans** (not principal amount) that are overdue beyond a threshold — typically 30+ DPD.

Different from PAR — PAR is weighted by outstanding principal amount, delinquency rate is by loan count.

### Formula
```
Delinquency Rate (30+) = Number of loans with DPD ≥ 30
                         ──────────────────────────────── × 100
                              Total number of active loans
```

### Example
```
Total active loans              = 1,000
Loans with 30+ DPD              = 65

Delinquency Rate = 65 / 1,000 × 100 = 6.5%
```

### PAR vs Delinquency Rate — Key Difference
| Metric | Measures | Use case |
|--------|----------|----------|
| PAR | % of outstanding **amount** at risk | Risk / Finance — how much money is at risk |
| Delinquency Rate | % of **loans** overdue | Operations — how many borrowers need follow-up |

A small number of large loans can make PAR look bad while delinquency rate looks fine — and vice versa.

### SQL
```sql
SELECT
    COUNT(CASE WHEN dpd >= 30 THEN 1 END) /
    COUNT(*) * 100 AS delinquency_rate_30
FROM loan_tape
WHERE loan_status = 'ACTIVE';
```

---

## 6. Roll Rate

### What is it?
The percentage of loans that **move from one delinquency bucket to a worse bucket** in the next period.

It is a forward-looking metric — it tells you where your portfolio is heading, not just where it is today.

### Formula
```
Roll Rate (Bucket 1 → Bucket 2) =

    Loans that were in Bucket 1 last month AND are in Bucket 2 this month
    ───────────────────────────────────────────────────────────────────── × 100
                   Total loans that were in Bucket 1 last month
```

### Example
```
Loans in Bucket 1 last month            = 200
Of those, now in Bucket 2 this month    = 60

Roll Rate (B1 → B2) = 60 / 200 × 100 = 30%
```

### Roll Rate Matrix
A full roll rate matrix shows movement between all buckets:

```
                    This Month
                X    B1    B2    B3   NPA
Last     X    [92%]  [5%]  [2%]  [1%]  [0%]
Month    B1   [25%] [45%] [20%] [8%]  [2%]
         B2   [10%] [15%] [40%] [25%] [10%]
         B3   [5%]  [5%]  [15%] [45%] [30%]
```

- Numbers across a row add up to 100%.
- Diagonal = loans staying in the same bucket.
- Above diagonal = loans getting worse (rolling forward).
- Below diagonal = loans improving (curing).

### Why it matters
High roll rates mean your portfolio is deteriorating. Lenders use roll rates to:
- Forecast future NPA levels
- Adjust provisioning
- Decide when to tighten lending criteria

---

## 7. Cure Rate

### What is it?
The percentage of delinquent loans that **return to current (0 DPD)** status. The opposite of roll rate.

### Formula
```
Cure Rate = Loans that were overdue last month AND are current this month
            ────────────────────────────────────────────────────────────── × 100
                         Total loans that were overdue last month
```

### Example
```
Loans overdue last month            = 300
Of those, now current this month    = 105

Cure Rate = 105 / 300 × 100 = 35%
```

### What's a good number?
- Cure rates above **40–50%** for Bucket 1 are healthy — most early delinquents pay up.
- Cure rates drop significantly for Bucket 2 and 3 — the deeper the overdue, the harder the recovery.
- A rising cure rate = collections team is working. A falling cure rate = serious concern.

---

## 8. Bounce Rate

### What is it?
The percentage of EMIs where the NACH auto-debit **failed** (bounced) — meaning the borrower's bank account didn't have sufficient funds on the debit date.

### Formula
```
Bounce Rate = Number of NACH debits that bounced
              ───────────────────────────────────── × 100
                   Total NACH debits attempted
```

### Example
```
Total NACH debits attempted     = 5,000
Bounced                         = 350

Bounce Rate = 350 / 5,000 × 100 = 7%
```

### Why it matters
- A bounce is the **earliest possible signal** of financial stress — even before DPD starts.
- A rising bounce rate month-on-month is a leading indicator of future delinquency.
- Collections teams are alerted immediately on bounce events to initiate outreach.

---

## How These Metrics Connect

These metrics aren't independent — they form a chain:

```
Bounce Rate rises
        ↓
OTR falls
        ↓
Delinquency Rate rises
        ↓
Roll Rate increases (loans moving to worse buckets)
        ↓
PAR 30 / PAR 60 rises
        ↓
NPA Ratio rises
        ↓
Provisioning increases → Profits fall
```

Conversely, a good collections operation raises Cure Rate, which slows the roll rate, which stabilises PAR and NPA.

**This is why Collections is not a cost centre — it directly protects the P&L.**

---

## Metrics at a Glance

| Metric | Level | Measures | Good signal | Warning signal |
|--------|-------|----------|-------------|----------------|
| PAR 30 | Portfolio | % amount at risk | < 5% | > 10% |
| NPA Ratio | Portfolio | % amount non-performing | < 3% | > 7% |
| OTR | EMI | % paid on time | > 90% | < 80% |
| Collection Efficiency | Portfolio | % amount collected | > 95% | < 85% |
| Delinquency Rate | Loan count | % loans overdue | < 5% | > 10% |
| Roll Rate | Bucket | % getting worse | < 20% | > 40% |
| Cure Rate | Bucket | % recovering | > 40% | < 20% |
| Bounce Rate | EMI | % NACH failures | < 5% | > 10% |

---

## Where this file fits in the repo

```
payments_loan_journey/
├── README.md
├── glossary/
├── database/
└── analytics/
    ├── loan_tape.md
    └── metrics_and_kpis.md     ← you are here
```

---

[← Loan Tape](./loan_tape.md) | [Back to Analytics Overview](./)
