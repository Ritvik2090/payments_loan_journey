# 📘 Loan Disbursal Glossary — Bank & NBFC Reference

> A comprehensive guide to loan lifecycle terminology used in Banks and NBFCs (Non-Banking Financial Companies) in India. Useful for engineers, analysts, and product folks building in the lending space.

---

## Table of Contents

1. [Loan Basics](#1-loan-basics)
2. [Dates & Timeline](#2-dates--timeline)
3. [Repayment Behaviour](#3-repayment-behaviour)
4. [Delinquency & Risk](#4-delinquency--risk)
5. [Collections](#5-collections)
6. [NPA & Write-Off](#6-npa--write-off)
7. [Credit & Compliance](#7-credit--compliance)

---

## 1. Loan Basics

### Loan
A financial agreement where a lender provides a sum of money to a borrower, who agrees to repay it over time with interest. In banking/NBFC context, loans are formally documented with legally binding terms.

> **Example:** A borrower takes a ₹5,00,000 personal loan from an NBFC.

---

### Principal
The original sum of money borrowed, excluding any interest or fees. EMI payments gradually reduce the outstanding principal over the loan tenure.

> **Example:** If you borrow ₹5,00,000, the principal is ₹5,00,000.

---

### Interest
The cost charged by the lender for providing the loan, expressed as an Annual Percentage Rate (APR) or monthly rate. Can be **flat rate** or **reducing balance** (most common).

> **Example:** 12% per annum on ₹5,00,000 = ₹60,000/year interest.

---

### Tenure
The total duration of the loan — the period within which the borrower must fully repay principal + interest.

> **Example:** A 24-month tenure means 24 EMI payments.

---

### EMI (Equated Monthly Instalment)
A fixed monthly payment made by the borrower. Each EMI has two components:
- **Principal component** — reduces outstanding loan
- **Interest component** — cost of borrowing

Under the reducing balance method, early EMIs are more interest-heavy. As principal reduces, more of each EMI goes toward principal.

> **Example:** EMI = ₹23,500/month for 24 months.

---

### Loan Agreement / Sanction Letter
The formal document issued by the lender confirming loan approval. Contains loan amount, interest rate, tenure, EMI schedule, and all terms & conditions. Must be signed before disbursal.

---

## 2. Dates & Timeline

### Disbursal Date
The date on which the loan amount is transferred from the lender to the borrower's account (or directly to a third party like a dealer or vendor). This is **Day 0** of the loan lifecycle.

> **Example:** Loan of ₹5,00,000 credited on 1st Jan 2024 → Disbursal Date = 1st Jan 2024.

---

### EMI Due Date / Deadline
The specific date each month by which the EMI must be paid. Missing this date triggers late fees and delinquency tracking.

> **Example:** EMI due on the 5th of every month.

---

### Payment Date
The actual date the borrower makes the EMI payment. Compared against the due date to determine if the payment is on-time, early, or late.

> **Example:** EMI due on 5th, paid on 3rd → Payment Date = 3rd (early ✅).

---

### Completion Date / Maturity Date
The expected date on which the loan is fully repaid if all EMIs are paid as scheduled. The date of the last EMI.

> **Example:** 24-month loan disbursed Jan 2024 → Completion Date = Dec 2025.

---

### Cool-Off Period
A window (typically 3–7 days after disbursal) within which the borrower can cancel the loan and return the principal without any prepayment penalty. Mandated by RBI for digital/fintech lenders.

> **Example:** Borrower cancels loan on Day 2 of a 3-day cool-off → no penalty charged.

---

### Moratorium Period
A lender-granted pause on EMI payments, often provided during financial distress (e.g., COVID-19 RBI relief). Interest typically continues to accrue during this period.

> **Example:** 3-month moratorium → no EMIs due for 3 months, but interest accumulates.

---

## 3. Repayment Behaviour

### On-Time Payment
An EMI paid on or before the due date. Positively impacts the borrower's CIBIL score. Lenders track **OTR (On-Time Rate)** as a core portfolio health metric.

> **Example:** EMI due 5th Jan, paid 4th Jan → On-Time ✅.

---

### Prepayment
Payment of an amount over and above the scheduled EMI, reducing outstanding principal ahead of schedule. Two types:
- **Part-prepayment** — partial extra payment
- **Foreclosure** — full early closure

May attract prepayment charges depending on lender policy and loan type.

> **Example:** Paying ₹50,000 extra in month 6 reduces remaining principal and future interest burden.

---

### Part-Payment
A lump-sum payment in addition to the regular EMI that reduces outstanding principal. After part-payment, the borrower can choose to:
- Reduce the EMI amount (same tenure), or
- Reduce the remaining tenure (same EMI)

> **Example:** ₹1,00,000 part-payment in month 10 on a 24-month loan → borrower opts to cut tenure to 18 months.

---

### Foreclosure / Pre-closure
Full repayment of the entire outstanding loan amount before the scheduled maturity date. RBI has waived foreclosure charges for floating-rate loans. Fixed-rate loans may attract 2–5% penalty.

> **Example:** Closing a 24-month loan in month 12 = Foreclosure.

---

## 4. Delinquency & Risk

### Default
Failure to make an EMI payment by the due date. Even 1 day past due is technically a default, though most lenders have a grace period. Repeated defaults lead to NPA classification.

> **Example:** EMI due 5th Jan, not paid by 5th Jan → Default event triggered.

---

### DPD (Days Past Due)
The number of days an EMI payment is overdue from its due date. DPD is the **core metric** for tracking delinquency severity and classifying loans into risk buckets.

> **Example:** EMI due Jan 5, paid Jan 20 → DPD = 15.

---

### Delinquency Buckets
Groupings of loans based on DPD to measure risk and prioritize collections. Standard buckets:

| Bucket | DPD Range | Risk Level |
|--------|-----------|------------|
| X (Current) | 0 DPD | No overdue |
| Bucket 1 | 1–30 DPD | Early delinquency |
| Bucket 2 | 31–60 DPD | Moderate risk |
| Bucket 3 | 61–90 DPD | High risk |
| NPA | 90+ DPD | Non-Performing Asset |

---

### Delinquency Rate
The percentage of loans in a portfolio that are overdue (typically 30+ DPD). A key portfolio health indicator monitored by lenders and the RBI.

> **Example:** 50 out of 1,000 loans at 30+ DPD → Delinquency Rate = 5%.

---

### Roll Rate
The percentage of loans that move ("roll") from one delinquency bucket to a worse bucket in the next period. High roll rates signal deteriorating portfolio quality.

> **Example:** 40% of Bucket 1 loans moving to Bucket 2 next month = 40% roll rate.

---

### Cure Rate
The percentage of delinquent loans that return to current (0 DPD) status. High cure rates indicate effective collections operations.

> **Example:** 30 of 50 overdue loans paid up → Cure Rate = 60%.

---

## 5. Collections

### Collections Process
The systematic approach lenders use to recover overdue payments. Typically structured in stages based on DPD:

| DPD Stage | Action |
|-----------|--------|
| 0–7 DPD | Automated SMS / WhatsApp reminders |
| 7–30 DPD | Tele-calling by collections team |
| 30–60 DPD | Intensive follow-up + field visits |
| 60–90 DPD | Legal notices + settlement offers |
| 90+ DPD | NPA resolution / legal proceedings |

---

### PTP (Promise to Pay)
A commitment made by the borrower during a collections interaction, specifying when they will make the overdue payment. Collections teams track PTP-kept rates as a performance metric.

> **Example:** Borrower promises to pay on 15th Jan → PTP date = 15th Jan. If not paid, flagged as broken PTP.

---

### Settlement
An agreement where the lender accepts a reduced amount (less than total outstanding) to close the loan. Typically a last resort before write-off. Negatively impacts the borrower's CIBIL score — marked as "Settled" (not "Closed").

> **Example:** Outstanding ₹80,000, settled for ₹55,000 → lender absorbs ₹25,000 loss.

---

### Recovery
Money collected from NPA or written-off loans after the fact. Can happen through direct borrower payment, collateral liquidation, or third-party collection agencies (ARCs — Asset Reconstruction Companies).

> **Example:** ₹30,000 recovered from a previously written-off ₹1,00,000 loan = 30% recovery rate.

---

## 6. NPA & Write-Off

### NPA (Non-Performing Asset)
As per RBI guidelines, a loan becomes NPA when principal or interest is overdue for **90 days or more**. NPAs are classified into three sub-categories:

| Classification | Duration as NPA |
|----------------|-----------------|
| Sub-standard | Up to 12 months |
| Doubtful | 12–36 months |
| Loss Asset | 36+ months |

NPAs are closely monitored by RBI and directly impact a bank's capital adequacy and lending capacity.

---

### Provisioning
Funds that lenders must set aside to cover potential NPA losses, as mandated by RBI. Higher NPA classification = higher provisioning requirement = lower reported profits.

> **Example:** Sub-standard: 15% provisioning. Loss assets: 100% provisioning.

---

### Gross NPA vs Net NPA
- **Gross NPA** — Total value of all NPAs in the portfolio.
- **Net NPA** — Gross NPA minus provisions already set aside.

Net NPA is the truer reflection of actual credit risk exposure.

> **Example:** Gross NPA ₹10 Cr, Provisions ₹3 Cr → Net NPA = ₹7 Cr.

---

### Write-Off
The accounting process of removing an irrecoverable bad loan from the lender's books after exhausting all recovery options. **Important:** Write-off is an accounting action — the borrower is NOT legally absolved. Recovery efforts and legal proceedings continue.

> **Example:** A ₹2,00,000 loan with near-zero recovery probability gets written off → removed from books, flagged in borrower's credit history.

---

## 7. Credit & Compliance

### Credit Score (CIBIL Score)
A 3-digit score (300–900) representing a borrower's creditworthiness based on repayment history, credit utilization, and loan types. Scores above 750 are considered good. Lenders pull credit reports before loan disbursal.

> **Example:** Score of 780 → low-risk borrower → eligible for better interest rate.

---

### LTV (Loan to Value Ratio)
The ratio of the loan amount to the market value of the collateral asset. Higher LTV = higher lender risk. RBI mandates LTV caps for different loan categories (e.g., home loans, gold loans).

> **Example:** Loan ₹4,00,000 on asset worth ₹5,00,000 → LTV = 80%.

---

### FOIR (Fixed Obligation to Income Ratio)
The ratio of a borrower's total fixed monthly obligations (all EMIs combined) to their gross monthly income. Used to assess repayment capacity. Typically capped at 40–50% by lenders.

> **Example:** Monthly EMIs ₹20,000 on income of ₹50,000 → FOIR = 40%.

---

### NACH (National Automated Clearing House)
RBI's electronic mandate system used to auto-debit EMIs from the borrower's bank account on the due date. Replaces the older system of post-dated cheques (PDCs). A NACH bounce is treated as a missed EMI.

> **Example:** EMI of ₹23,500 auto-debited via NACH on the 5th of every month.

---

### Hypothecation
A charge created on a movable asset (e.g., a vehicle) as security for a loan, without transferring ownership to the lender. If the borrower defaults, the lender has the right to seize and sell the asset.

> **Example:** Car hypothecated to the bank until the auto loan is fully cleared.

---

### NOC (No Objection Certificate)
A document issued by the lender after full loan repayment, confirming that all dues are cleared and the lender has no further claims on the borrower or the collateral asset.

> **Example:** NOC issued after final EMI on a car loan → hypothecation removed from RC book.

---

## Quick Reference Cheat Sheet

| Term | One-liner |
|------|-----------|
| Principal | Original loan amount |
| EMI | Fixed monthly repayment |
| DPD | Days overdue past due date |
| Disbursal Date | Day loan is credited |
| Maturity Date | Day last EMI is due |
| Cool-Off | Cancel window post disbursal |
| Delinquency Bucket | Risk group based on DPD |
| NPA | 90+ DPD → Non-Performing |
| Write-Off | Removed from books (not forgiven) |
| Foreclosure | Early full repayment |
| NACH | Auto-debit mandate for EMIs |
| FOIR | EMI burden vs income ratio |
| LTV | Loan amount vs collateral value |
| PTP | Borrower's promise to pay date |
| Cure Rate | % delinquent loans that pay up |
| Roll Rate | % loans worsening in DPD bucket |
| Settlement | Partial payment to close loan |
| Provisioning | Funds set aside for NPA losses |

---

> **Regulatory context:** All terms are in the context of Indian banking regulations governed by the **Reserve Bank of India (RBI)**. Guidelines referenced include the RBI Master Circular on Income Recognition, Asset Classification and Provisioning (IRACP norms).
