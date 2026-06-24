import { useState } from "react";

const terms = [
  {
    category: "Loan Basics",
    color: "#1E3A5F",
    items: [
      {
        term: "Loan",
        definition:
          "A financial agreement where a lender provides a sum of money to a borrower, who agrees to repay it over time with interest. In banking/NBFC context, loans are formally documented with legally binding terms.",
        example: "A borrower takes a ₹5,00,000 personal loan from an NBFC.",
      },
      {
        term: "Principal",
        definition:
          "The original sum of money borrowed, excluding any interest or fees. EMI payments reduce the outstanding principal over the loan tenure.",
        example: "If you borrow ₹5,00,000, the principal is ₹5,00,000.",
      },
      {
        term: "Interest",
        definition:
          "The cost charged by the lender for providing the loan, expressed as an Annual Percentage Rate (APR) or monthly rate. Can be flat or reducing balance.",
        example: "12% per annum interest on ₹5,00,000 = ₹60,000/year.",
      },
      {
        term: "Tenure",
        definition:
          "The total duration of the loan agreement — the period within which the borrower must fully repay the loan including principal and interest.",
        example: "A 24-month tenure means 24 EMI payments.",
      },
      {
        term: "EMI (Equated Monthly Instalment)",
        definition:
          "A fixed monthly payment made by the borrower to the lender. Each EMI consists of a principal component and an interest component. Early EMIs are more interest-heavy; later ones are more principal-heavy (under reducing balance method).",
        example: "EMI = ₹23,500/month for 24 months.",
      },
      {
        term: "Loan Agreement / Sanction Letter",
        definition:
          "The formal document issued by the lender confirming loan approval with terms including loan amount, interest rate, tenure, EMI, and repayment schedule.",
        example: "Signed sanction letter is mandatory before disbursal.",
      },
    ],
  },
  {
    category: "Dates & Timeline",
    color: "#1A5276",
    items: [
      {
        term: "Disbursal Date",
        definition:
          "The date on which the loan amount is transferred from the lender to the borrower's account (or directly to a third party like a dealer/vendor). This is day 0 of the loan lifecycle.",
        example: "Loan of ₹5,00,000 credited on 1st Jan 2024 = Disbursal Date.",
      },
      {
        term: "EMI Due Date / Deadline",
        definition:
          "The specific date each month by which the EMI must be paid. Missing this date triggers late fees and delinquency tracking. Usually set 30 days from disbursal or on a fixed date of the month.",
        example: "EMI due on the 5th of every month.",
      },
      {
        term: "Payment Date",
        definition:
          "The actual date on which the borrower makes the EMI payment. Compared against the due date to determine if payment is on-time, early, or late.",
        example: "EMI due on 5th, paid on 3rd → Payment Date = 3rd (early).",
      },
      {
        term: "Completion Date / Maturity Date",
        definition:
          "The expected date on which the loan is fully repaid if all EMIs are paid as scheduled. Last EMI payment date = Completion Date.",
        example: "24-month loan disbursed Jan 2024 → Completion Date Dec 2025.",
      },
      {
        term: "Cool-Off Period",
        definition:
          "A window (typically 3–7 days after disbursal) within which the borrower can cancel the loan and return the principal without any prepayment penalty. Mandated by RBI for digital/fintech lenders.",
        example: "Borrower cancels loan within 3-day cool-off → no penalty.",
      },
      {
        term: "Moratorium Period",
        definition:
          "A lender-granted pause on EMI payments, often offered during financial stress (e.g., COVID-19 relief). Interest may still accrue during this period.",
        example: "3-month moratorium → no EMIs due, but interest accumulates.",
      },
    ],
  },
  {
    category: "Repayment Behaviour",
    color: "#1E8449",
    items: [
      {
        term: "On-Time Payment",
        definition:
          "An EMI paid on or before the due date. Positively impacts the borrower's credit score (CIBIL/Experian). Lenders track on-time payment rate (OTR) as a portfolio health metric.",
        example: "EMI due 5th Jan, paid 4th Jan → On-Time.",
      },
      {
        term: "Prepayment",
        definition:
          "Payment of an amount over and above the scheduled EMI, reducing the outstanding principal ahead of schedule. Can be partial (part-prepayment) or full (foreclosure). May attract prepayment charges.",
        example: "Paying ₹50,000 extra in month 6 reduces remaining principal.",
      },
      {
        term: "Foreclosure / Pre-closure",
        definition:
          "Full repayment of the outstanding loan amount before the scheduled maturity date. Lenders may charge a foreclosure fee (typically 2–5% of outstanding principal). RBI has waived foreclosure charges for floating-rate loans.",
        example: "Closing a 24-month loan in month 12 = Foreclosure.",
      },
      {
        term: "Part-Payment",
        definition:
          "A lump-sum payment made in addition to the regular EMI, reducing the principal. After part-payment, the borrower can choose to either reduce EMI amount or reduce remaining tenure.",
        example: "₹1,00,000 part-payment in month 10 reduces outstanding principal.",
      },
    ],
  },
  {
    category: "Delinquency & Risk",
    color: "#922B21",
    items: [
      {
        term: "Default",
        definition:
          "Failure to make an EMI payment by the due date. Technically, even 1 day past due is a default, though lenders typically have grace periods. Repeated defaults lead to NPA classification.",
        example: "EMI due 5th Jan not paid by 5th Jan = Default event.",
      },
      {
        term: "DPD (Days Past Due)",
        definition:
          "The number of days an EMI payment is overdue from its due date. DPD is the core metric used to track delinquency severity and classify loans into buckets.",
        example: "EMI due Jan 5, paid Jan 20 → DPD = 15.",
      },
      {
        term: "Delinquency Buckets",
        definition:
          "Groupings of loans based on DPD to measure risk and prioritize collections. Standard buckets used across banks and NBFCs:",
        buckets: [
          { label: "X (Current)", dpd: "0 DPD", color: "#27AE60", desc: "No overdue" },
          { label: "Bucket 1", dpd: "1–30 DPD", color: "#F39C12", desc: "Early delinquency" },
          { label: "Bucket 2", dpd: "31–60 DPD", color: "#E67E22", desc: "Moderate risk" },
          { label: "Bucket 3", dpd: "61–90 DPD", color: "#E74C3C", desc: "High risk" },
          { label: "NPA", dpd: "90+ DPD", color: "#922B21", desc: "Non-Performing Asset" },
        ],
      },
      {
        term: "Delinquency Rate",
        definition:
          "The percentage of loans in a portfolio that are overdue (typically 30+ DPD). A key portfolio health indicator monitored by lenders and regulators.",
        example: "50 out of 1000 loans at 30+ DPD → Delinquency Rate = 5%.",
      },
      {
        term: "Roll Rate",
        definition:
          "The percentage of loans that 'roll' from one delinquency bucket to a worse bucket in the next period. High roll rates indicate deteriorating portfolio quality.",
        example: "40% of Bucket 1 loans moving to Bucket 2 = 40% roll rate.",
      },
      {
        term: "Cure Rate",
        definition:
          "The percentage of delinquent loans that return to current (0 DPD) status after being overdue. High cure rates indicate effective collections.",
        example: "30 of 50 overdue loans paid up → Cure Rate = 60%.",
      },
    ],
  },
  {
    category: "Collections",
    color: "#6C3483",
    items: [
      {
        term: "Collections Process",
        definition:
          "The systematic approach lenders use to recover overdue payments. Typically structured in stages based on DPD: soft reminders (IVR/SMS) → tele-calling → field visits → legal action.",
        stages: [
          { stage: "0–7 DPD", action: "Automated SMS/WhatsApp reminders" },
          { stage: "7–30 DPD", action: "Tele-calling by collections team" },
          { stage: "30–60 DPD", action: "Intensive follow-up + field visits" },
          { stage: "60–90 DPD", action: "Legal notices + settlement offers" },
          { stage: "90+ DPD", action: "NPA resolution / legal proceedings" },
        ],
      },
      {
        term: "PTP (Promise to Pay)",
        definition:
          "A commitment made by the borrower during a collections call specifying when they will make the overdue payment. Tracked by collections teams to measure promise-keeping rates.",
        example: "Borrower promises to pay on 15th Jan → PTP date = 15th Jan.",
      },
      {
        term: "Settlement",
        definition:
          "An agreement where the lender accepts a reduced amount (less than total outstanding) to close the loan. Usually a last resort before write-off. Negatively impacts the borrower's credit score.",
        example: "Outstanding ₹80,000, settled for ₹55,000.",
      },
      {
        term: "Recovery",
        definition:
          "Money collected from NPA or written-off loans. Recovery can happen through direct payment, asset liquidation, or third-party collection agencies.",
        example: "₹30,000 recovered from a previously written-off ₹1,00,000 loan.",
      },
    ],
  },
  {
    category: "NPA & Write-Off",
    color: "#17202A",
    items: [
      {
        term: "NPA (Non-Performing Asset)",
        definition:
          "As per RBI guidelines, a loan becomes NPA when interest or principal is overdue for 90 days or more (3 months). NPAs are classified into Sub-standard, Doubtful, and Loss assets based on duration.",
        classification: [
          { type: "Sub-standard", period: "Up to 12 months as NPA", color: "#E74C3C" },
          { type: "Doubtful", period: "12–36 months as NPA", color: "#922B21" },
          { type: "Loss Asset", period: "36+ months as NPA", color: "#17202A" },
        ],
      },
      {
        term: "Provisioning",
        definition:
          "Funds set aside by a lender to cover potential losses from NPAs. RBI mandates specific provisioning percentages based on NPA classification. Higher NPA = higher provisioning requirement = lower profits.",
        example: "15% provisioning for Sub-standard assets, 100% for Loss assets.",
      },
      {
        term: "Write-Off",
        definition:
          "The accounting process of removing a bad loan from the lender's books after exhausting all recovery options. The loan is 'written off' as a loss. Write-off does NOT mean the borrower is legally absolved — recovery efforts continue.",
        example: "A ₹2,00,000 loan with 0% recovery probability gets written off.",
      },
      {
        term: "Gross NPA vs Net NPA",
        definition:
          "Gross NPA is the total value of all NPAs. Net NPA = Gross NPA minus provisions already set aside. Net NPA is a truer reflection of a lender's credit risk exposure.",
        example: "Gross NPA ₹10Cr, Provisions ₹3Cr → Net NPA = ₹7Cr.",
      },
    ],
  },
  {
    category: "Credit & Compliance",
    color: "#0E6655",
    items: [
      {
        term: "Credit Score (CIBIL Score)",
        definition:
          "A 3-digit score (300–900) representing the borrower's creditworthiness based on repayment history, credit utilization, and loan types. Scores above 750 are considered good. Lenders pull credit reports before disbursal.",
        example: "Score of 780 → low risk → better interest rate offered.",
      },
      {
        term: "LTV (Loan to Value Ratio)",
        definition:
          "The ratio of the loan amount to the market value of the collateral asset. A higher LTV means higher lender risk. RBI caps LTV ratios for different loan types.",
        example: "Loan ₹4,00,000 on asset worth ₹5,00,000 → LTV = 80%.",
      },
      {
        term: "FOIR (Fixed Obligation to Income Ratio)",
        definition:
          "The ratio of a borrower's total fixed monthly obligations (all loan EMIs) to their monthly income. Used to assess repayment capacity. Typically capped at 40–50%.",
        example: "Monthly EMIs ₹20,000 on ₹50,000 income → FOIR = 40%.",
      },
      {
        term: "NOC (No Objection Certificate)",
        definition:
          "A document issued by the lender after full loan repayment, confirming that no dues remain and the borrower has fulfilled all obligations. Needed to release hypothecation on assets like vehicles.",
        example: "NOC issued after final EMI paid for a car loan.",
      },
      {
        term: "Hypothecation",
        definition:
          "A charge created on an asset (e.g., a vehicle) as collateral for a loan, without transferring ownership. If the borrower defaults, the lender can seize and sell the asset.",
        example: "Car hypothecated to the bank until the auto loan is cleared.",
      },
      {
        term: "NACH (National Automated Clearing House)",
        definition:
          "RBI's mandate system used to auto-debit EMIs from the borrower's bank account on the due date. Replaces post-dated cheques. A NACH bounce is treated as a missed EMI.",
        example: "EMI auto-debited via NACH mandate every 5th of the month.",
      },
    ],
  },
];

export default function LoanGlossary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState({});

  const categories = ["All", ...terms.map((t) => t.category)];

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const filtered = terms
    .filter((cat) => activeCategory === "All" || cat.category === activeCategory)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.term.toLowerCase().includes(search.toLowerCase()) ||
          (item.definition && item.definition.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F7F9FC", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#0D1B2A", padding: "40px 32px 32px", color: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#5DADE2", marginBottom: 8, textTransform: "uppercase" }}>
            Bank & NBFC Reference
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>
            Loan Disbursal Glossary
          </h1>
          <p style={{ color: "#AEB6BF", fontSize: 14, margin: "0 0 28px" }}>
            Complete terminology guide for loan lifecycle, delinquency tracking, and collections.
          </p>
          <input
            placeholder="Search terms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", maxWidth: 480, padding: "10px 16px", borderRadius: 8,
              border: "1px solid #2C3E50", background: "#1B2631", color: "white",
              fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ background: "#EBF0F5", borderBottom: "1px solid #D5DBDB", overflowX: "auto" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 4, padding: "0 32px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "12px 16px", border: "none", background: "transparent",
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: activeCategory === cat ? "2px solid #2E86C1" : "2px solid transparent",
                color: activeCategory === cat ? "#2E86C1" : "#5D6D7E",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px" }}>
        {filtered.map((cat) => (
          <div key={cat.category} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: cat.color }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1B2631", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
                {cat.category}
              </h2>
              <div style={{ height: 1, flex: 1, background: "#D5DBDB" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.items.map((item, idx) => {
                const key = `${cat.category}-${idx}`;
                const isOpen = expanded[key];
                return (
                  <div
                    key={idx}
                    style={{
                      background: "white", borderRadius: 10, border: "1px solid #E8ECF0",
                      overflow: "hidden", boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: "100%", padding: "16px 20px", background: "transparent",
                        border: "none", cursor: "pointer", display: "flex",
                        justifyContent: "space-between", alignItems: "center", textAlign: "left",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#1B2631" }}>{item.term}</span>
                      </div>
                      <span style={{ color: "#AEB6BF", fontSize: 18, fontWeight: 300 }}>{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: "0 20px 20px 40px" }}>
                        <p style={{ color: "#34495E", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>
                          {item.definition}
                        </p>

                        {/* Delinquency Buckets visual */}
                        {item.buckets && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0" }}>
                            {item.buckets.map((b, i) => (
                              <div key={i} style={{
                                background: b.color + "18", border: `1px solid ${b.color}`,
                                borderRadius: 8, padding: "8px 12px", minWidth: 100,
                              }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.label}</div>
                                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{b.dpd}</div>
                                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{b.desc}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Collections stages */}
                        {item.stages && (
                          <div style={{ margin: "12px 0", borderLeft: "2px solid #E8ECF0", paddingLeft: 12 }}>
                            {item.stages.map((s, i) => (
                              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#6C3483", minWidth: 90 }}>{s.stage}</span>
                                <span style={{ fontSize: 12, color: "#555" }}>{s.action}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* NPA classification */}
                        {item.classification && (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
                            {item.classification.map((c, i) => (
                              <div key={i} style={{
                                background: c.color + "15", border: `1px solid ${c.color}`,
                                borderRadius: 8, padding: "8px 14px",
                              }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.type}</div>
                                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.period}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.example && (
                          <div style={{
                            background: "#F0F7FF", borderLeft: "3px solid #2E86C1",
                            padding: "10px 14px", borderRadius: "0 6px 6px 0", marginTop: 8,
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#2E86C1", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              Example:{" "}
                            </span>
                            <span style={{ fontSize: 13, color: "#2C3E50" }}>{item.example}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#AEB6BF" }}>
            No terms match your search.
          </div>
        )}

        <div style={{ borderTop: "1px solid #D5DBDB", marginTop: 20, paddingTop: 20, color: "#AEB6BF", fontSize: 12, textAlign: "center" }}>
          Reference guide for Loan Disbursal & Collections · Bank & NBFC context · RBI guidelines
        </div>
      </div>
    </div>
  );
}
