# Why Open Source Matters for Regulated Quality Systems: The Case for QAtrial

*The regulated software market charges premium prices for opacity. It is time for a different model.*

---

The enterprise quality management software market is worth over $15 billion and growing. The products that dominate it -- IBM Engineering Requirements Management DOORS, Siemens Polarion, Jama Connect, MasterControl, Veeva Vault Quality -- share three characteristics: they are proprietary, they are expensive, and they are opaque.

IBM DOORS licenses start north of $10,000 per user per year for the full requirements management suite. Jama Connect and Polarion are in similar territory. MasterControl and Veeva Vault Quality charge annual subscription fees that put them out of reach for any organization that is not a mid-to-large enterprise. These are not prices for optional productivity tools. For companies in regulated industries -- pharmaceuticals, medical devices, biotechnology, clinical research -- quality management software is effectively mandatory. The regulations demand documented requirements, traced test cases, risk assessments, audit trails, and electronic signatures. You either buy the software or you do it in Excel, which is a different kind of expensive.

The irony is stark. The pharmaceutical industry, which depends on clinical trial transparency and reproducible manufacturing processes, manages its quality systems with software whose source code it cannot inspect. The medical device industry, which is required by ISO 14971 to identify and mitigate all foreseeable risks, uses quality platforms where the risk of software defects is mitigated by vendor assurances rather than code review.

QAtrial is an argument that this does not have to be the case.

## Why Regulated Industries Have Been Slow to Adopt Open Source

The hesitation is understandable. Regulated companies face unique constraints:

**Validation requirements.** Any software used in a GxP context must be validated -- demonstrated to be fit for its intended use through documented testing. With proprietary software, the vendor typically provides validation documentation (IQ/OQ/PQ protocols, release notes, known defect lists). With open source, the responsibility falls entirely on the user organization. Many quality teams do not have the resources or expertise to validate software they did not purchase with a support contract.

**Audit trail and electronic signature requirements.** 21 CFR Part 11 and EU Annex 11 mandate specific controls for electronic records: audit trails, electronic signatures with re-authentication, system access controls, and data integrity safeguards. Quality teams worry that open-source tools lack these features or implement them insufficiently.

**Auditor expectations.** When an FDA inspector or a notified body auditor asks what system you use for requirements management, "an open-source React application" can provoke more questions than "IBM DOORS." Rightly or wrongly, brand recognition carries weight in audit rooms.

**Support and liability concerns.** If a commercial quality system fails during a regulatory submission, you have a vendor to call. With open source, you have a GitHub issues page.

These are legitimate concerns. But the landscape is shifting.

## Why That Is Changing

**GAMP 5 Second Edition.** The 2022 revision of ISPE's Good Automated Manufacturing Practice guidance explicitly acknowledges that modern software development includes open-source components and that risk-based approaches should govern validation decisions. The guidance moves away from the prescriptive V-model toward a more flexible framework that accommodates agile development, continuous integration, and COTS (Commercial Off-The-Shelf) software -- a category that, in practice, increasingly includes open source. The key principle is risk-based validation: focus your testing effort where the risk is highest, not where the vendor fee is largest.

**Regulatory modernization.** The FDA's QMSR (Quality Management System Regulation) for medical devices is aligning US requirements with ISO 13485, an international standard that is technology-agnostic. ICH E6(R3) is modernizing Good Clinical Practice for technology-enabled trials. Neither prescribes specific commercial tools.

**Enterprise open-source precedent.** Linux runs the majority of the world's servers. PostgreSQL and MySQL are trusted with financial transaction data. Kubernetes orchestrates mission-critical workloads. The argument that open source cannot be trusted in regulated environments rings hollow when regulated environments already run on open-source infrastructure.

## QAtrial's Open-Source Advantages

### 1. Full Source Code Inspection

When an auditor asks "how does your system ensure audit trail integrity?", with proprietary software you point to vendor documentation and trust that it is accurate. With QAtrial, you can show them the exact TypeScript function that logs audit entries, the Zustand store that persists them to localStorage, and the export function that generates the CSV. There is no black box.

For organizations undergoing FDA inspections or notified body audits, this transparency is not a liability -- it is an asset. The ability to demonstrate exactly how the system works, rather than relying on vendor attestations, can increase auditor confidence in your quality system.

### 2. No Vendor Lock-In

QAtrial stores all data as JSON -- in localStorage for runtime, in exportable JSON files for backup and transfer. There is no proprietary database format, no vendor-specific API required to extract your own data, no contractual restrictions on data portability.

If you decide QAtrial is not the right fit, you export your project as JSON and migrate to whatever tool you choose. Your requirements, tests, audit trail entries, and risk assessments are yours. Try doing that with DOORS or MasterControl.

### 3. Data Sovereignty Through Self-Hosting

QAtrial runs entirely in the browser. No cloud account, no SaaS subscription, no data processing agreement required. For pharmaceutical companies handling pre-submission regulatory data, medical device companies managing proprietary design specifications, or CROs processing clinical trial data subject to GDPR and 21 CFR Part 11, this is not a minor consideration.

When the AI compliance co-pilot is configured with a local Ollama instance, even AI-assisted features run without any data leaving the organization's network. No API calls to external services, no data processed by third-party models, no data residency questions to answer.

### 4. Community-Driven Regulatory Templates

QAtrial's template system encodes regulatory knowledge -- the specific requirements that apply to a US pharmaceutical company versus a German medical device startup versus a Japanese CRO. This knowledge is currently fragmented across expensive consulting engagements, proprietary databases, and individual regulatory professionals' expertise.

Open-sourcing this knowledge means a regulatory affairs specialist in Brazil can contribute ANVISA-specific templates, a consultant specializing in Korean medical device regulations can add MFDS requirements, and a GMP expert in India can refine Schedule M templates. The community becomes a distributed regulatory intelligence network.

### 5. Customizable Without Vendor Dependency

Commercial quality systems offer customization through configuration panels, custom fields, and sometimes scripting languages. But there are always limits -- limits to the workflow, limits to the data model, limits to the UI. When you hit those limits, you file a feature request with the vendor and wait.

With QAtrial, the code is yours. Need a custom report format for a specific regulatory authority? Add it. Need to integrate with an internal ERP system? Build the connector. Need to modify the risk matrix scoring to match your organization's risk appetite? Change the thresholds. The only constraint is your development team's capability, not a vendor's product roadmap.

### 6. Free to Start, Scales with You

A medical device startup with two engineers can run QAtrial on day one at zero cost. As the company grows, the tool grows with it. There is no "you've exceeded your free tier" email, no surprise invoice when you add a fifth user, no feature gate that prevents you from using electronic signatures until you upgrade to the enterprise plan.

## What AGPL-3.0 Means in Practice

QAtrial uses the GNU Affero General Public License v3.0. This is a strong copyleft license with specific implications:

**You can use QAtrial freely** for any purpose, including commercial use. A pharmaceutical company using QAtrial internally for quality management incurs no licensing obligation beyond using the software.

**If you modify the source code and distribute it** (or offer it as a network service), you must make your modifications available under the same AGPL-3.0 license. This is the copyleft mechanism: it prevents a company from taking the open-source code, adding proprietary features, and selling a closed-source version.

**Why AGPL-3.0 specifically?** The "Affero" clause extends the copyleft obligation to network use. If someone deploys a modified version of QAtrial as a web service (for example, a SaaS quality management platform), they must share their modifications. This prevents the "open-source bait-and-switch" where a company builds a commercial service on open-source code without contributing back.

**For most users, the practical implication is simple:** use QAtrial, modify it for your needs, and if you redistribute your modifications, share the source code. If you use it internally without distributing it, you have no obligations beyond the license terms.

## Addressing the Validation Question

"Can we validate open-source software for GxP use?"

Yes. Validation is not about whether software is open source or proprietary. It is about demonstrating that the software is fit for its intended use through documented testing. The steps are the same regardless of license:

1. Define User Requirements Specifications (URS)
2. Perform risk assessment to determine validation scope
3. Execute Installation Qualification (IQ) -- verify correct installation
4. Execute Operational Qualification (OQ) -- verify features work as specified
5. Execute Performance Qualification (PQ) -- verify the system performs in your environment
6. Document results in a Validation Summary Report (VSR)

QAtrial actually makes this easier than proprietary alternatives because you can inspect the source code to understand exactly what the system does, write more targeted test cases, and verify compliance features (audit trail, electronic signatures, change control) at the code level rather than relying on vendor claims.

## Feature Comparison

| Capability | QAtrial | IBM DOORS | Jama Connect | MasterControl |
|-----------|---------|-----------|-------------|---------------|
| License cost | Free (AGPL-3.0) | ~$10K+/user/year | ~$5K+/user/year | Custom pricing |
| Source code access | Full | None | None | None |
| Data format | Open JSON | Proprietary | Proprietary | Proprietary |
| Self-hosted option | Yes (browser-only) | On-premise available | Cloud-first | Cloud/on-premise |
| AI compliance co-pilot | Built-in (multi-provider) | Limited/add-on | Limited | Limited |
| Country-specific templates | 37 jurisdictions | Manual setup | Manual setup | Manual setup |
| Industry verticals | 10 built-in | Manual setup | Limited presets | Industry-specific |
| Electronic signatures | 21 CFR Part 11 compliant | Yes | Yes | Yes |
| Audit trail | Full with diffs | Yes | Yes | Yes |
| Multi-language UI | 12 languages | Limited | Limited | Limited |
| Vendor lock-in risk | None | High | High | High |
| Community contributions | Open | N/A | N/A | N/A |

The comparison is not entirely fair. IBM DOORS and Jama Connect are mature, enterprise-grade tools with decades of development, multi-user collaboration, role-based access control, and integrations with ALM ecosystems. QAtrial is a young project that currently stores data in localStorage and does not support concurrent multi-user access.

But that is exactly the point. For a startup, a small quality team, a consulting firm, a research lab, or any organization that needs compliant quality management without a five-figure annual software budget, QAtrial provides a credible starting point. And because it is open source, the community can close the feature gaps over time.

## The Future

QAtrial's current architecture -- a client-side React application with localStorage persistence -- is a starting point, not an endpoint. The design is modular enough to support future additions: a backend server for multi-user collaboration, a real database for scalability, role-based access control for enterprise deployments, and API integrations for ALM tool chains.

The open-source model means these features can be built by anyone. A company that needs multi-user support can build it and contribute it back. A consulting firm that needs custom report formats can add them. A regulatory authority that wants to publish machine-readable requirements can integrate with the template system.

The regulated quality software market does not need another proprietary vendor. It needs an open platform that the community can build on. QAtrial is that platform.

Available at [github.com/MeyerThorsten/QAtrial](https://github.com/MeyerThorsten/QAtrial).
