# 💸 Payments & Loan Journey

> A practical domain knowledge guide for anyone working with **loans, disbursals, and collections** in the Indian Banking & NBFC ecosystem.

Whether you're an engineer building a lending platform, an analyst working with repayment data, or a product manager trying to understand why a loan goes bad — this repo is for you.

---

## 🧭 What is this repo?

When you join a fintech, bank, or NBFC, you're suddenly surrounded by terms like *DPD*, *NPA*, *NACH bounce*, *delinquency buckets*, and *write-offs* — and nobody hands you a manual.

This repo is that manual.

It documents the **complete lifecycle of a loan** — from the day money is disbursed to the borrower, all the way to repayment, default, collections, and closure.

---

## 📂 Repo Structure

```
payments_loan_journey/
│
├── README.md                  ← You are here
├── about_loan.md              ← What is a loan? Simple intro
│
└── glossary/
    ├── loan_glossary.md       ← Full terminology reference (Markdown)
    └── loan-glossary.jsx      ← Interactive glossary (React component)
```

---

## 📖 The Loan Lifecycle — At a Glance

```
[Application] → [Credit Check] → [Sanction] → [Disbursal]
                                                    ↓
                                              EMI Schedule Begins
                                                    ↓
                              ┌─────────────────────────────────┐
                              │         Monthly EMI Due         │
                              └─────────────────────────────────┘
                                        ↓              ↓
                                   Paid on time      Missed
                                        ↓              ↓
                                  Credit Score+     DPD Clock Starts
                                                       ↓
                                              ┌────────────────┐
                                              │ 1–30 DPD       │ ← Bucket 1
                                              │ 31–60 DPD      │ ← Bucket 2
                                              │ 61–90 DPD      │ ← Bucket 3
                                              │ 90+ DPD → NPA  │ ← Non-Performing
                                              └────────────────┘
                                                       ↓
                                          Collections Process Triggered
                                                       ↓
                              ┌──────────────────────────────────────┐
                              │  Resolved?                           │
                              │  Yes → Loan Closed (NOC issued)  ✅  │
                              │  No  → Settlement / Write-Off    ❌  │
                              └──────────────────────────────────────┘
```

---

## 📚 Glossary — Topics Covered

| Category | Terms |
|----------|-------|
| 🏦 Loan Basics | Loan, Principal, Interest, EMI, Tenure, Sanction Letter |
| 📅 Dates & Timeline | Disbursal Date, Due Date, Payment Date, Maturity Date, Cool-Off, Moratorium |
| 💳 Repayment | On-Time Payment, Prepayment, Part-Payment, Foreclosure |
| ⚠️ Delinquency | Default, DPD, Delinquency Buckets, Roll Rate, Cure Rate |
| 📞 Collections | Collections Process, PTP, Settlement, Recovery |
| 🔴 NPA & Write-Off | NPA, Provisioning, Gross/Net NPA, Write-Off |
| 📋 Credit & Compliance | CIBIL Score, FOIR, LTV, NACH, Hypothecation, NOC |

→ Full reference: [`glossary/loan_glossary.md`](./glossary/loan_glossary.md)

---

## ⚡ Quick Cheat Sheet

| Term | Plain English |
|------|--------------|
| **Principal** | The actual amount you borrowed |
| **EMI** | Fixed monthly repayment (principal + interest) |
| **DPD** | How many days overdue is the payment |
| **Disbursal Date** | Day the loan money was sent to borrower |
| **Cool-Off Period** | Window to cancel the loan, no penalty |
| **Delinquency Bucket** | Risk group based on DPD (1–30, 31–60, 61–90) |
| **NPA** | Loan overdue 90+ days → Non-Performing Asset |
| **Write-Off** | Removed from books. Borrower still owes the money. |
| **Foreclosure** | Borrower pays off entire loan early |
| **NACH** | Auto-debit system for monthly EMIs |
| **FOIR** | Your total EMI burden vs your income |
| **PTP** | Borrower's promise to pay on a specific date |
| **Cure Rate** | % of overdue loans that got paid up |
| **Roll Rate** | % of loans getting worse (moving to next DPD bucket) |

---

## 🇮🇳 Regulatory Context

All content is in the context of **Indian lending regulations** governed by the **Reserve Bank of India (RBI)**.

Key guidelines referenced:
- RBI Master Circular — Income Recognition, Asset Classification & Provisioning (IRACP Norms)
- RBI Digital Lending Guidelines (Cool-Off Period, NACH mandates)
- CIBIL / Credit Information Bureau reporting standards

---

## 🙋 Who is this for?

- 👨‍💻 **Engineers** building loan management systems, payment pipelines, or collections tools
- 📊 **Data Analysts** working with repayment tables, DPD tracking, or portfolio dashboards
- 🗂️ **Product Managers** at fintech companies or NBFCs
- 🎓 **Anyone new** to the lending domain who wants to get up to speed fast

---

## 🚀 What's Coming Next

- [ ] SQL schema for a loan repayment tracking table
- [ ] DPD calculation logic with examples
- [ ] Collections funnel metrics explained
- [ ] Sample dataset for practice
- [ ] Visual diagrams for delinquency bucket flows

---

## 🤝 Contributing

Found a term missing? Have a better example? PRs and Issues are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b add-new-term`
3. Make your changes
4. Open a Pull Request

---

## 📬 Author

**Ritvik** — building domain knowledge in public, one repo at a time.

[![GitHub](https://img.shields.io/badge/GitHub-Ritvik2090-black?style=flat&logo=github)](https://github.com/Ritvik2090)

---

> *"You don't need to be a banker to understand loans. You just need a good glossary."*
