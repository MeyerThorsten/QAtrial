/**
 * United States — Base Regulatory Template
 *
 * Generic US regulatory requirements applicable regardless of industry vertical.
 * Covers federal regulations on electronic records, data privacy, security,
 * accessibility, and business continuity.
 */

import type { CountryTemplateSet } from '../../types';

export const templateSet: CountryTemplateSet = {
  countryCode: 'US',
  requirements: [
    // -----------------------------------------------------------------------
    // FDA 21 CFR Part 11
    // -----------------------------------------------------------------------
    {
      title: 'FDA 21 CFR Part 11 — Electronic Records',
      description:
        'Systems that create, modify, maintain, archive, retrieve, or transmit electronic records in fulfillment of FDA regulations shall comply with 21 CFR Part 11. Requirements include: validation, audit trails, system access controls, authority checks, device checks, operational checks, personnel training, documentation controls, and open/closed system controls.',
      category: 'Regulatory Compliance',
      tags: ['part-11', 'electronic-records', 'fda', 'compliance'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR Part 11',
    },
    {
      title: 'FDA 21 CFR Part 11 — Electronic Signatures',
      description:
        'Electronic signatures used as the legally binding equivalent of handwritten signatures shall meet 21 CFR Part 11 Subpart C requirements: unique to one individual, identity verified before establishment, administered by a central authority, requiring at least two distinct identification components (e.g., user ID + password).',
      category: 'Regulatory Compliance',
      tags: ['part-11', 'electronic-signatures', 'fda', 'authentication'],
      riskLevel: 'critical',
      regulatoryRef: '21 CFR 11.100-11.200',
    },

    // -----------------------------------------------------------------------
    // SOC 2
    // -----------------------------------------------------------------------
    {
      title: 'SOC 2 Type II Compliance',
      description:
        'The system and hosting infrastructure shall satisfy the AICPA Trust Services Criteria for SOC 2 Type II across applicable categories: Security (CC1-CC9), Availability (A1), Processing Integrity (PI1), Confidentiality (C1), and Privacy (P1-P8). Annual SOC 2 Type II audit reports shall be obtained and reviewed.',
      category: 'Security',
      tags: ['soc-2', 'trust-services', 'audit', 'security'],
      riskLevel: 'high',
      regulatoryRef: 'AICPA Trust Services Criteria (2017)',
    },

    // -----------------------------------------------------------------------
    // HIPAA
    // -----------------------------------------------------------------------
    {
      title: 'HIPAA Security Rule Compliance',
      description:
        'If the system processes Protected Health Information (PHI), it shall comply with the HIPAA Security Rule (45 CFR Part 164 Subpart C). Required safeguards include: administrative (risk analysis, workforce training, access management), physical (facility access, workstation security, device/media controls), and technical (access control, audit controls, integrity controls, transmission security).',
      category: 'Privacy & Security',
      tags: ['hipaa', 'phi', 'security-rule', 'health-data'],
      riskLevel: 'critical',
      regulatoryRef: '45 CFR Part 164 Subpart C (HIPAA Security Rule)',
    },
    {
      title: 'HIPAA Privacy Rule — Minimum Necessary',
      description:
        'The system shall enforce the HIPAA minimum necessary standard, limiting use and disclosure of PHI to the minimum amount necessary to accomplish the intended purpose. Role-based access, data segmentation, and de-identification capabilities shall be provided.',
      category: 'Privacy & Security',
      tags: ['hipaa', 'privacy-rule', 'minimum-necessary', 'de-identification'],
      riskLevel: 'high',
      regulatoryRef: '45 CFR 164.502(b) (HIPAA Privacy Rule)',
    },

    // -----------------------------------------------------------------------
    // Accessibility
    // -----------------------------------------------------------------------
    {
      title: 'ADA Section 508 Accessibility',
      description:
        'The system user interface shall conform to Section 508 of the Rehabilitation Act (aligned with WCAG 2.1 Level AA) to ensure accessibility for users with disabilities. Requirements include: perceivable content (text alternatives, captions), operable interface (keyboard navigable, sufficient time), understandable presentation (readable, predictable), and robust compatibility with assistive technologies.',
      category: 'Accessibility',
      tags: ['accessibility', 'section-508', 'wcag', 'ada'],
      riskLevel: 'medium',
      regulatoryRef: 'Section 508 (29 USC 794d); WCAG 2.1 Level AA',
    },

    // -----------------------------------------------------------------------
    // OWASP
    // -----------------------------------------------------------------------
    {
      title: 'OWASP Top 10 Security Controls',
      description:
        'The application shall implement controls to mitigate the OWASP Top 10 risks: broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable and outdated components, identification and authentication failures, software and data integrity failures, security logging and monitoring failures, and server-side request forgery.',
      category: 'Security',
      tags: ['owasp', 'application-security', 'vulnerability', 'top-10'],
      riskLevel: 'high',
      regulatoryRef: 'OWASP Top 10 (2021)',
    },

    // -----------------------------------------------------------------------
    // CCPA/CPRA
    // -----------------------------------------------------------------------
    {
      title: 'CCPA/CPRA Privacy Compliance',
      description:
        'If the system processes personal information of California residents, it shall comply with the California Consumer Privacy Act (CCPA) as amended by CPRA. Capabilities shall include: consumer right to know, right to delete, right to opt-out of sale/sharing, right to correct, right to limit sensitive data use, and non-discrimination. Privacy notices shall be provided at point of collection.',
      category: 'Privacy',
      tags: ['ccpa', 'cpra', 'privacy', 'california', 'consumer-rights'],
      riskLevel: 'medium',
      regulatoryRef: 'Cal. Civ. Code 1798.100 et seq. (CCPA/CPRA)',
    },

    // -----------------------------------------------------------------------
    // PCI DSS
    // -----------------------------------------------------------------------
    {
      title: 'PCI DSS Compliance for Payment Data',
      description:
        'If the system processes, stores, or transmits payment card data, it shall comply with PCI DSS v4.0. Key requirements include: network segmentation, firewall configuration, strong cryptography for cardholder data, vulnerability management, access control, monitoring and logging, regular security testing, and an information security policy.',
      category: 'Security',
      tags: ['pci-dss', 'payment', 'cardholder-data', 'encryption'],
      riskLevel: 'high',
      regulatoryRef: 'PCI DSS v4.0',
    },

    // -----------------------------------------------------------------------
    // NIST CSF
    // -----------------------------------------------------------------------
    {
      title: 'NIST Cybersecurity Framework Alignment',
      description:
        'The organization shall align its cybersecurity program with the NIST Cybersecurity Framework (CSF) 2.0 core functions: Govern, Identify, Protect, Detect, Respond, and Recover. A cybersecurity risk assessment shall be conducted annually, and the security posture shall be documented and reported to senior management.',
      category: 'Security',
      tags: ['nist-csf', 'cybersecurity', 'framework', 'risk-assessment'],
      riskLevel: 'high',
      regulatoryRef: 'NIST CSF 2.0 (2024)',
    },

    // -----------------------------------------------------------------------
    // Audit Logging
    // -----------------------------------------------------------------------
    {
      title: 'Security Audit Logging and Monitoring',
      description:
        'The system shall maintain comprehensive security audit logs capturing: authentication events (success/failure), authorization failures, privilege escalation, data access to sensitive records, administrative actions, and system errors. Logs shall be retained for a minimum of one year (accessible) and seven years (archived). Real-time monitoring and alerting shall be implemented for security-critical events.',
      category: 'Security',
      tags: ['audit-logging', 'monitoring', 'siem', 'retention'],
      riskLevel: 'high',
      regulatoryRef: 'NIST SP 800-92; SOC 2 CC7.2',
    },

    // -----------------------------------------------------------------------
    // Data Encryption
    // -----------------------------------------------------------------------
    {
      title: 'Data Encryption at Rest and in Transit',
      description:
        'All sensitive and regulated data shall be encrypted at rest using AES-256 (or equivalent NIST-approved algorithm) and in transit using TLS 1.2 or higher. Encryption key management shall follow NIST SP 800-57 guidelines including: key generation, distribution, storage, rotation, and destruction. HSM or equivalent key protection shall be used for production keys.',
      category: 'Security',
      tags: ['encryption', 'aes-256', 'tls', 'key-management'],
      riskLevel: 'critical',
      regulatoryRef: 'NIST SP 800-175B; FIPS 140-3',
    },

    // -----------------------------------------------------------------------
    // DR/BC
    // -----------------------------------------------------------------------
    {
      title: 'Disaster Recovery and Business Continuity',
      description:
        'A disaster recovery (DR) plan shall be maintained defining: Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for each critical system, failover procedures, communication plan, backup verification, and DR testing schedule (at least annually). A business continuity plan (BCP) shall ensure critical business functions can continue during and after a disaster.',
      category: 'Business Continuity',
      tags: ['disaster-recovery', 'business-continuity', 'rto', 'rpo'],
      riskLevel: 'high',
      regulatoryRef: 'NIST SP 800-34; SOC 2 A1.2',
    },

    // -----------------------------------------------------------------------
    // MFA
    // -----------------------------------------------------------------------
    {
      title: 'Multi-Factor Authentication Requirement',
      description:
        'Multi-factor authentication (MFA) shall be required for all user accounts accessing regulated data or administrative functions. MFA shall combine at least two of: knowledge factor (password), possession factor (TOTP/FIDO2 token), or inherence factor (biometric). Phishing-resistant MFA (FIDO2/WebAuthn) is preferred for high-privilege accounts.',
      category: 'Authentication',
      tags: ['mfa', 'authentication', 'fido2', 'phishing-resistant'],
      riskLevel: 'high',
      regulatoryRef: 'NIST SP 800-63B; OMB M-22-09 (Zero Trust)',
    },

    // -----------------------------------------------------------------------
    // FedRAMP (where applicable)
    // -----------------------------------------------------------------------
    {
      title: 'Data Residency — US Jurisdiction',
      description:
        'All regulated data shall be stored and processed within the United States or in jurisdictions with adequate data transfer agreements. Data residency controls shall ensure that backups, disaster recovery replicas, and processing activities comply with applicable US data localization requirements.',
      category: 'Data Governance',
      tags: ['data-residency', 'jurisdiction', 'localization'],
      riskLevel: 'medium',
      regulatoryRef: 'Various (HIPAA, ITAR, FedRAMP)',
    },
  ],

  tests: [
    {
      title: 'Verify 21 CFR Part 11 Compliance Controls',
      description:
        'Perform a comprehensive assessment of Part 11 controls. Verify: system validation documentation exists, audit trail captures required elements per 11.10(e), electronic signatures meet 11.50/11.70/11.100, access controls enforce unique user IDs per 11.10(d), and operational system checks are functional.',
      category: 'Compliance',
      tags: ['part-11', 'compliance', 'assessment-test'],
      linkedReqTags: ['part-11', 'electronic-records', 'electronic-signatures'],
    },
    {
      title: 'Verify HIPAA Technical Safeguards',
      description:
        'Test HIPAA technical safeguards: verify unique user identification, emergency access procedure, automatic logoff, encryption of PHI at rest and in transit, integrity controls, and audit controls. Test that access to PHI is limited to minimum necessary based on role.',
      category: 'Security',
      tags: ['hipaa', 'technical-safeguards', 'security-test'],
      linkedReqTags: ['hipaa', 'phi', 'security-rule', 'minimum-necessary'],
    },
    {
      title: 'Verify Section 508 Accessibility',
      description:
        'Perform accessibility testing using automated tools (axe, Lighthouse) and manual review. Verify WCAG 2.1 Level AA conformance: keyboard navigation, screen reader compatibility, color contrast ratios, focus management, alternative text, and form labeling. Document any exceptions with remediation plan.',
      category: 'Accessibility',
      tags: ['accessibility', 'wcag', 'automated-test'],
      linkedReqTags: ['accessibility', 'section-508', 'wcag'],
    },
    {
      title: 'Verify OWASP Top 10 Mitigations',
      description:
        'Perform application security testing covering OWASP Top 10. Execute: SAST/DAST scanning, injection testing (SQL, XSS, command), authentication and session testing, access control testing, cryptographic verification, and dependency vulnerability scanning. Document findings with severity ratings.',
      category: 'Security',
      tags: ['owasp', 'penetration-test', 'security-scanning'],
      linkedReqTags: ['owasp', 'application-security', 'vulnerability'],
    },
    {
      title: 'Verify Data Encryption Implementation',
      description:
        'Verify encryption at rest: confirm AES-256 is used for database and file storage. Verify encryption in transit: confirm TLS 1.2+ is enforced, weak cipher suites are disabled. Verify key management: keys are stored in HSM or KMS, rotation schedule is followed, and retired keys are properly destroyed.',
      category: 'Security',
      tags: ['encryption', 'verification', 'key-management-test'],
      linkedReqTags: ['encryption', 'aes-256', 'tls', 'key-management'],
    },
    {
      title: 'Verify MFA Implementation',
      description:
        'Test MFA for all user roles. Verify: MFA is required on login, MFA cannot be bypassed, failed MFA attempts are logged, account lockout occurs after threshold, recovery flow is secure, and FIDO2/WebAuthn is available for high-privilege accounts.',
      category: 'Security',
      tags: ['mfa', 'authentication', 'enforcement-test'],
      linkedReqTags: ['mfa', 'authentication', 'fido2'],
    },
    {
      title: 'Verify SOC 2 Control Effectiveness',
      description:
        'Review the most recent SOC 2 Type II report. Verify: all Trust Services Criteria in scope are covered, no qualified opinions exist, complementary user entity controls (CUECs) are implemented, and any identified exceptions have documented remediation plans.',
      category: 'Compliance',
      tags: ['soc-2', 'audit-review', 'control-test'],
      linkedReqTags: ['soc-2', 'trust-services', 'audit'],
    },
    {
      title: 'Verify Disaster Recovery Procedure',
      description:
        'Execute (or review results of) a DR test. Verify: failover completes within documented RTO, data loss does not exceed RPO, all critical systems are operational post-failover, communication plan was executed, and failback procedure restores normal operations without data loss.',
      category: 'Business Continuity',
      tags: ['disaster-recovery', 'dr-test', 'failover-test'],
      linkedReqTags: ['disaster-recovery', 'business-continuity', 'rto'],
    },
    {
      title: 'Verify CCPA/CPRA Consumer Rights',
      description:
        'Test consumer rights implementation: submit a right-to-know request and verify data is provided within 45 days, submit a right-to-delete request and verify data is removed, verify opt-out of sale/sharing mechanism is functional, and verify non-discrimination for consumers exercising rights.',
      category: 'Privacy',
      tags: ['ccpa', 'consumer-rights', 'privacy-test'],
      linkedReqTags: ['ccpa', 'cpra', 'privacy', 'consumer-rights'],
    },
    {
      title: 'Verify Security Audit Log Completeness',
      description:
        'Perform security-relevant actions (login, failed login, privilege change, data access, admin action) and verify each generates an audit log entry. Verify logs contain: timestamp, user identity, action, source IP, and result. Verify log retention meets the 1-year accessible / 7-year archive policy.',
      category: 'Security',
      tags: ['audit-logging', 'completeness', 'retention-test'],
      linkedReqTags: ['audit-logging', 'monitoring', 'siem'],
    },
  ],
};

export default templateSet;
