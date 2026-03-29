# QAtrial: Open-Source AI-Powered Quality Management for Regulated Industries

*A free, auditable, AI-assisted quality workspace that knows your country's regulations before you open it.*

---

If you work in pharmaceuticals, medical devices, biotechnology, or any other regulated industry, you already know the pain. Quality documentation consumes weeks. Traceability matrices are maintained in spreadsheets that nobody trusts. Audit preparation is a fire drill. And the commercial tools that promise to fix all of this -- IBM DOORS, Polarion, Jama Connect, MasterControl -- start at price points that make startup founders weep and enterprise procurement cycles drag on for months.

QAtrial is an open-source alternative. It is a regulated quality workspace built with React and TypeScript that runs entirely in your browser, requires no server, and ships with an AI compliance co-pilot that can generate test cases, classify risks, run gap analyses, and draft audit-ready reports. It is published under the AGPL-3.0 license, which means it is free to use, free to inspect, and free to modify -- with the condition that modifications to the source code must be shared back with the community.

## The Problem QAtrial Solves

Regulated industries operate under frameworks like FDA 21 CFR Part 11, EU Annex 11, ISO 13485, ICH Q9, and GAMP 5. These frameworks demand rigorous documentation: every requirement must be traced to a test, every risk must be assessed, every change must be logged with an audit trail, and every critical record must carry an electronic signature.

The work is necessary. Patient safety, product quality, and regulatory compliance depend on it. But the tooling has not kept up. Most quality teams still rely on a patchwork of Word documents, Excel spreadsheets, and expensive proprietary platforms that lock data behind vendor APIs and charge per-seat license fees that can exceed $10,000 per user per year.

The result is a two-tier system. Large pharmaceutical companies can afford enterprise quality management suites. Everyone else -- startups, small medical device companies, CROs, clinical laboratories -- is left cobbling together solutions that auditors view with justified skepticism.

## What QAtrial Does Differently

### Regulatory Intelligence Built In

QAtrial is not a generic project management tool with a "regulated" label slapped on it. It ships with a four-dimensional template composition engine that generates jurisdiction-specific, industry-specific requirements and test cases at project creation time.

The four dimensions are:

1. **Country** -- 37 jurisdictions with specific regulatory authority templates (FDA for the US, BfArM for Germany, PMDA for Japan, NMPA for China, and so on)
2. **Industry Vertical** -- 10 GxP domains including Pharmaceuticals, Medical Devices, Biotechnology, Clinical Research, Clinical Laboratories, Logistics/GDP, Software/IT, Cosmetics, Aerospace, and Chemical/Environmental
3. **Project Type** -- Software, Embedded/IoT, QMS, Validation, Clinical, Compliance, or Supplier Quality
4. **Quality Modules** -- 15 composable modules covering Audit Trail, Electronic Signatures, Data Integrity (ALCOA+), CAPA, Risk Management, Document Control, and more

Select USA + Pharmaceuticals + Software + Audit Trail, Electronic Signatures, CAPA, and Validation/CSV, and you get 20+ FDA-specific requirements pre-loaded with references to 21 CFR Part 11, GAMP 5, and ICH Q10, along with matching test cases already linked via tag-based traceability. Select Germany + Medical Devices + Embedded, and the system loads EU MDR 2017/745 and ISO 14971 requirements with BfArM-specific overlays on top of the EU GMP base.

This is not a simple lookup table. Templates compose through a layered architecture: EU base templates load first, then country-specific overlays refine them, then vertical templates add industry requirements, then project type templates specialize further, and finally module templates layer in cross-cutting quality controls. Deduplication ensures no redundant requirements make it into your project.

### AI Compliance Co-Pilot

QAtrial includes six AI-powered capabilities:

- **Test Case Generation**: Point the AI at any requirement and get 4-6 context-aware test cases with steps, expected results, and confidence scores. The prompts are tuned to your country, vertical, and applicable standards.
- **Risk Classification**: AI-proposed severity and likelihood ratings using the correct risk taxonomy for your vertical -- ISO 14971 for medical devices, ICH Q9 for pharmaceuticals, GAMP 5 for software systems, FMEA for aerospace and laboratories.
- **Regulatory Gap Analysis**: Compare your project's requirements against applicable standard clauses. The AI identifies covered, partially covered, and missing clauses, with suggestions for remediation.
- **CAPA Suggestions**: For any failed test, get a structured corrective and preventive action proposal with root cause analysis, containment actions, and effectiveness check criteria.
- **Executive Compliance Brief**: A one-click C-level summary of your project's compliance posture.
- **Validation Summary Report (VSR)**: A seven-section, audit-ready report generated from your project data with AI-written narrative sections.

The AI system supports multiple providers -- Anthropic Claude, OpenAI-compatible APIs (including OpenRouter), and local Ollama instances. Purpose-scoped routing lets you send different tasks to different models: a powerful model for report generation, a faster one for risk classification, a local model for sensitive data that must not leave your network.

### No Server, No Cloud Dependency

QAtrial runs entirely in the browser. All data is stored in localStorage. There is no database, no backend server, no cloud account required. For organizations handling sensitive clinical data or proprietary manufacturing processes, this is not a limitation -- it is a feature. Your data stays on your machine.

For teams that need to share data, QAtrial supports JSON import and export with referential integrity validation. A project can be exported, sent to a colleague, and imported without data loss.

### Compliance Features That Actually Work

Electronic signatures follow the 21 CFR Part 11 / EU Annex 11 model: each signature captures the signer's identity, the meaning (authored, reviewed, approved, verified, or rejected), the reason, and requires re-authentication. The audit trail logs every create, modify, delete, status change, link, unlink, approval, rejection, signature, export, and report generation event with before-and-after diffs, timestamps, and user identification. Both can be exported to CSV for auditor review.

Change control is configurable per vertical. For strict verticals like Pharmaceuticals and Medical Devices, it enforces minimum approver counts, required reasons, mandatory electronic signatures, and automatic approval reversion when approved records are modified.

### Seven Dashboard Views

The evaluation dashboard provides real-time visibility into project quality:

- **Overview**: Coverage metrics, status charts, traceability matrix, orphaned items
- **Compliance**: Weighted readiness score (0-100%) combining requirement coverage, test coverage, pass rate, risk assessment, and signature completeness, plus AI-powered gap analysis
- **Risk**: Interactive 5x5 severity-by-likelihood matrix with bulk AI classification
- **Evidence**: Per-requirement evidence completeness tracking
- **CAPA**: Failed test funnel with AI corrective action suggestions
- **Trends**: Status distributions and coverage by category
- **Portfolio**: Multi-project overview (enterprise feature)

### Internationalization

The entire UI is available in 12 languages: English, German, French, Spanish, Italian, Portuguese, Dutch, Japanese, Chinese (Simplified), Korean, Hindi, and Thai. Language switching is instant, with lazy-loaded translation files to keep the bundle lean.

## The AGPL-3.0 License

QAtrial is published under the GNU Affero General Public License v3.0. This means:

- **Free to use**: No license fees, no per-seat charges, no feature gates
- **Free to modify**: Adapt the code to your specific needs
- **Copyleft obligation**: If you modify QAtrial and distribute it or offer it as a network service, you must make your modifications available under the same license
- **Full transparency**: Auditors can inspect every line of code that handles their data

For regulated industries, the copyleft requirement is not just a legal obligation -- it is a quality assurance mechanism. It means the community benefits from every improvement, and no one can take the code proprietary without contributing back.

## Getting Started

```bash
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial
npm install
npm run dev
```

The development server starts on `http://localhost:5173`. A six-step setup wizard guides you through country selection, vertical selection, project metadata, project type, module selection, and a preview of generated requirements and tests. Sixteen demo projects are included, spanning countries from the US to Japan and verticals from Pharmaceuticals to Medical Devices.

## Contributing

QAtrial is 84 TypeScript source files and 14,000+ lines of code. The template system is designed for community contribution: adding support for a new country means writing a single template file with jurisdiction-specific requirements and tests. Adding a new vertical follows the same pattern.

The project is on GitHub at [github.com/MeyerThorsten/QAtrial](https://github.com/MeyerThorsten/QAtrial). Star it, fork it, file issues, submit pull requests. Regulated quality management should not be a luxury reserved for companies that can afford six-figure software contracts.
