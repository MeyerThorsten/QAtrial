/**
 * Logistics / GDP / GSP Vertical — Common Templates
 *
 * Comprehensive Good Distribution Practice requirements and tests for
 * pharmaceutical and healthcare logistics, covering WHO GDP, temperature
 * mapping, cold chain, serialization, track & trace, warehouse qualification,
 * and transport validation.
 */

import type { VerticalTemplateSet } from '../../types';

export const templateSet: VerticalTemplateSet = {
  verticalId: 'logistics',
  requirements: [
    // -----------------------------------------------------------------------
    // WHO GDP Fundamentals
    // -----------------------------------------------------------------------
    {
      title: 'WHO Good Distribution Practices Compliance',
      description:
        'The pharmaceutical distribution system shall comply with WHO Model Guidance for the Storage and Transport of Time- and Temperature-Sensitive Pharmaceutical Products (TRS 961 Annex 9) and regional GDP guidelines. A quality management system shall cover: organization and management, personnel, premises and equipment, documentation, operations, complaints and recalls, self-inspections, and transportation.',
      category: 'GDP',
      tags: ['gdp', 'who-gdp', 'quality-system', 'distribution'],
      riskLevel: 'critical',
      regulatoryRef: 'WHO TRS 961 Annex 9; EU GDP Guidelines 2013/C 343/01',
    },
    {
      title: 'Temperature Mapping of Storage Facilities',
      description:
        'Temperature mapping studies shall be performed for all pharmaceutical storage areas (warehouses, cold rooms, refrigerators, freezers) to demonstrate uniform temperature distribution. Mapping shall be conducted: during initial qualification, after significant modifications, and periodically (at least every 3-5 years). Studies shall cover worst-case conditions (summer and winter), identify hot and cold spots, and define monitoring sensor placement.',
      category: 'Temperature Control',
      tags: ['temperature-mapping', 'storage', 'qualification', 'sensor-placement'],
      riskLevel: 'high',
      regulatoryRef: 'WHO TRS 961 Annex 9; EU GDP Chapter 3',
    },
    {
      title: 'Cold Chain Management and Monitoring',
      description:
        'A cold chain management system shall ensure temperature-sensitive products are maintained within specified temperature ranges (2-8°C, -20°C, -70°C, etc.) throughout storage and distribution. Requirements include: calibrated temperature monitoring devices, real-time alerts for excursions, excursion investigation and product impact assessment, qualified cold chain packaging, and training for all cold chain personnel.',
      category: 'Cold Chain',
      tags: ['cold-chain', 'temperature-monitoring', 'excursion', 'real-time-alert'],
      riskLevel: 'critical',
      regulatoryRef: 'WHO TRS 961 Annex 9 Section 4; EU GDP Chapter 9',
    },
    {
      title: 'Warehouse Qualification (IQ/OQ/PQ)',
      description:
        'Pharmaceutical warehouses and storage facilities shall be qualified through IQ/OQ/PQ. IQ shall verify: construction, HVAC installation, racking systems, security systems, and pest control. OQ shall verify: temperature and humidity control under loaded and empty conditions, door opening studies, and power failure recovery. PQ shall demonstrate consistent performance under routine operating conditions over an extended period.',
      category: 'Qualification',
      tags: ['warehouse-qualification', 'iq-oq-pq', 'hvac', 'storage-facility'],
      riskLevel: 'high',
      regulatoryRef: 'WHO TRS 961 Annex 9; EU GDP Chapter 3.2',
    },
    {
      title: 'Transport Validation and Lane Qualification',
      description:
        'Transportation lanes shall be qualified to demonstrate products are maintained within acceptable temperature ranges during transit. Qualification shall include: route risk assessment, seasonal profiling (summer/winter), packaging qualification per ISTA 7D or equivalent, last-mile delivery assessment, and contingency planning for delays. Validated shipping configurations shall be documented with maximum transit times.',
      category: 'Transport',
      tags: ['transport-validation', 'lane-qualification', 'shipping', 'ista-7d'],
      riskLevel: 'high',
      regulatoryRef: 'WHO TRS 961 Annex 9 Section 8; ISTA 7D/7E',
    },
    {
      title: 'Serialization and Track & Trace',
      description:
        'Pharmaceutical products shall be serialized per applicable regulations (EU FMD, DSCSA, national requirements). Each package shall carry a unique identifier (serial number + product code + batch + expiry) in GS1 DataMatrix format. The system shall support: serial number generation and management, aggregation (pack-to-case-to-pallet), verification, decommissioning, and data exchange with national verification systems.',
      category: 'Serialization',
      tags: ['serialization', 'track-trace', 'fmd', 'gs1-datamatrix'],
      riskLevel: 'high',
      regulatoryRef: 'EU FMD 2011/62/EU; DSCSA; WHO Member State Traceability',
    },
    {
      title: 'Pharmaceutical Packaging Qualification',
      description:
        'Packaging systems used for pharmaceutical transport shall be qualified. Qualification shall include: thermal performance testing at target ambient profiles, duration studies demonstrating maintenance of required temperature range, drop and vibration testing per ISTA protocols, and payload configuration studies. Reusable packaging shall have documented requalification intervals and inspection criteria.',
      category: 'Packaging',
      tags: ['packaging-qualification', 'thermal-performance', 'payload', 'reusable'],
      riskLevel: 'high',
      regulatoryRef: 'WHO TRS 961 Annex 9 Section 8; ISTA 7D',
    },
    {
      title: 'GDP Personnel Training and Competency',
      description:
        'All personnel involved in GDP activities shall receive initial and ongoing training covering: GDP principles, product handling, temperature management, documentation requirements, hygiene, and role-specific procedures. Training effectiveness shall be assessed. Designated persons (Responsible Person in EU) shall have documented qualifications and authority. Training records shall be maintained and reviewed.',
      category: 'Personnel',
      tags: ['gdp-training', 'competency', 'responsible-person', 'personnel'],
      riskLevel: 'medium',
      regulatoryRef: 'EU GDP Chapter 2; WHO TRS 961 Annex 9 Section 3',
    },
    {
      title: 'Returns, Recalls, and Falsified Product Procedures',
      description:
        'Procedures shall be established for: handling returned products (assessment for reintroduction to saleable stock or destruction), executing product recalls (classification, notification, effectiveness checks), and identifying and quarantining suspected falsified or counterfeit products. Returned products shall be stored separately until disposition. Recall mock exercises shall be conducted annually.',
      category: 'Product Security',
      tags: ['returns', 'recalls', 'falsified-products', 'quarantine'],
      riskLevel: 'critical',
      regulatoryRef: 'EU GDP Chapter 6; WHO TRS 961 Annex 9 Section 12',
    },
    {
      title: 'GDP Self-Inspection Program',
      description:
        'A self-inspection program shall be established to monitor implementation and compliance with GDP. Self-inspections shall cover all GDP elements at defined intervals. Findings shall be documented with CAPA. Management review of self-inspection results shall occur at least annually. The program shall also include assessment of outsourced GDP activities (transportation, warehousing).',
      category: 'Quality Assurance',
      tags: ['self-inspection', 'gdp-audit', 'capa', 'management-review'],
      riskLevel: 'medium',
      regulatoryRef: 'EU GDP Chapter 8; WHO TRS 961 Annex 9 Section 2',
    },
    {
      title: 'Calibration of Temperature Monitoring Equipment',
      description:
        'All temperature monitoring and recording equipment shall be calibrated at defined intervals (typically annually) against traceable reference standards. Calibration shall cover the operational temperature range. Out-of-tolerance findings shall trigger investigation of affected products. Calibration certificates shall be retained. Data loggers used for transport monitoring shall have documented accuracy specifications.',
      category: 'Equipment',
      tags: ['calibration', 'temperature-monitoring', 'data-logger', 'traceability'],
      riskLevel: 'high',
      regulatoryRef: 'WHO TRS 961 Annex 9 Section 5; EU GDP Chapter 3',
    },
    {
      title: 'Transportation Service Provider Qualification',
      description:
        'Third-party transportation providers shall be qualified through: GDP questionnaire, on-site audit (risk-based), quality agreement or GDP-specific contract, and ongoing performance monitoring. Qualification shall assess: temperature-controlled vehicle capabilities, driver training, contingency procedures, insurance coverage, and regulatory compliance. A qualified transporter list shall be maintained.',
      category: 'Supplier Quality',
      tags: ['transporter-qualification', 'service-provider', 'quality-agreement', 'audit'],
      riskLevel: 'high',
      regulatoryRef: 'EU GDP Chapter 7; WHO TRS 961 Annex 9 Section 9',
    },
  ],

  tests: [
    // -----------------------------------------------------------------------
    // Test Cases
    // -----------------------------------------------------------------------
    {
      title: 'Temperature Mapping Study Review',
      description:
        'Review temperature mapping reports for three storage areas. Verify: mapping duration covers at least 7 consecutive days (or seasonal worst case), sensor placement covers critical locations per ISPE or WHO guidance, hot and cold spots are identified and documented, monitoring sensor locations are justified based on mapping results, and alert/action limits are defined based on mapping data.',
      category: 'Temperature Control',
      tags: ['temperature-mapping', 'study-review', 'verification-test'],
      linkedReqTags: ['temperature-mapping', 'storage', 'qualification'],
    },
    {
      title: 'Cold Chain Excursion Response Test',
      description:
        'Simulate a temperature excursion event. Verify: the monitoring system generates an alert within defined timeframes, the alert reaches designated personnel, the excursion investigation procedure is initiated, product stability data is consulted for impact assessment, affected product is quarantined pending disposition, and the event is documented with CAPA if warranted.',
      category: 'Cold Chain',
      tags: ['cold-chain', 'excursion', 'response-test'],
      linkedReqTags: ['cold-chain', 'temperature-monitoring', 'excursion'],
    },
    {
      title: 'Warehouse Qualification Review',
      description:
        'Review IQ/OQ/PQ documentation for a representative warehouse. Verify: IQ confirms HVAC installation per design, OQ demonstrates temperature control under loaded and empty conditions, door-opening studies show acceptable recovery times, PQ demonstrates consistent performance over the qualifying period, and all deviations are documented with impact assessments.',
      category: 'Qualification',
      tags: ['warehouse-qualification', 'review', 'iq-oq-pq-test'],
      linkedReqTags: ['warehouse-qualification', 'iq-oq-pq', 'hvac'],
    },
    {
      title: 'Transport Lane Qualification Execution',
      description:
        'Review transport lane qualification for a representative route. Verify: route risk assessment identifies critical risk factors (climate, duration, transfers), seasonal data supports qualification conditions, data logger records demonstrate product temperature maintenance, packaging performance meets qualified duration, and contingency procedures are defined for delays.',
      category: 'Transport',
      tags: ['transport-validation', 'lane-qualification', 'execution-test'],
      linkedReqTags: ['transport-validation', 'lane-qualification', 'shipping'],
    },
    {
      title: 'Serialization System Verification',
      description:
        'Test the serialization system end-to-end. Verify: unique serial numbers are generated and assigned, GS1 DataMatrix codes are readable and contain correct data elements, aggregation (pack-to-case-to-pallet) is accurate, verification against the national system (EMVS, DSCSA) succeeds for legitimate products and rejects counterfeit serials, and decommissioning events are properly recorded.',
      category: 'Serialization',
      tags: ['serialization', 'verification', 'gs1-test'],
      linkedReqTags: ['serialization', 'track-trace', 'fmd'],
    },
    {
      title: 'Recall Mock Exercise',
      description:
        'Execute an annual recall mock exercise. Measure: time to identify all affected batches and distribution records, time to notify customers and authorities, effectiveness of communication (percentage of responses received), accuracy of distribution data, and time to quarantine or retrieve affected product. Compare results against predefined targets and document improvement actions.',
      category: 'Product Security',
      tags: ['recall', 'mock-exercise', 'effectiveness-test'],
      linkedReqTags: ['returns', 'recalls', 'falsified-products'],
    },
    {
      title: 'GDP Self-Inspection Effectiveness',
      description:
        'Review the GDP self-inspection program. Verify: all GDP elements are covered in the inspection schedule, inspections are performed at defined intervals, findings are classified and documented, CAPAs are tracked to closure and effectiveness is verified, management review of findings is documented, and outsourced activities are included in the inspection scope.',
      category: 'Quality Assurance',
      tags: ['self-inspection', 'effectiveness', 'program-review'],
      linkedReqTags: ['self-inspection', 'gdp-audit', 'capa'],
    },
    {
      title: 'Calibration Program Compliance',
      description:
        'Review the calibration program for temperature monitoring equipment. Verify: calibration schedule is current with no overdue instruments, calibration certificates reference traceable standards, acceptance criteria are defined and met, out-of-tolerance results trigger impact assessments on monitored products, and data loggers used for transport have documented accuracy and are within calibration.',
      category: 'Equipment',
      tags: ['calibration', 'compliance', 'program-test'],
      linkedReqTags: ['calibration', 'temperature-monitoring', 'data-logger'],
    },
  ],
};

export default templateSet;
