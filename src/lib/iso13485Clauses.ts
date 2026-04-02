/**
 * ISO 13485:2016 clause registry — used by both the static gap assessment
 * (keyword matching) and the AI-powered QMSR gap analysis.
 *
 * Each clause includes keywords that help the static matcher decide whether
 * existing project requirements address the clause.
 */

export interface ISO13485Clause {
  clause: string;
  title: string;
  section: string;           // top-level section name
  description: string;       // short summary of what the clause requires
  keywords: string[];        // lowercase keywords for static matching against req titles/descriptions
  criticality: 'critical' | 'high' | 'medium' | 'low';
}

export const ISO_13485_CLAUSES: ISO13485Clause[] = [
  // --- Section 4: Quality management system ---
  {
    clause: '4.1',
    title: 'Quality management system — General requirements',
    section: 'Quality Management System',
    description: 'Establish, document, implement, maintain and continually improve the QMS. Determine processes, sequence, interaction, criteria, resources, monitoring.',
    keywords: ['qms', 'quality management system', 'quality system', 'process interaction', 'continual improvement'],
    criticality: 'critical',
  },
  {
    clause: '4.2.1',
    title: 'Documentation — General',
    section: 'Quality Management System',
    description: 'QMS documentation shall include quality policy, quality objectives, quality manual, documented procedures, records.',
    keywords: ['documentation', 'quality policy', 'quality objectives', 'documented procedures'],
    criticality: 'high',
  },
  {
    clause: '4.2.2',
    title: 'Quality manual',
    section: 'Quality Management System',
    description: 'Establish and maintain a quality manual including scope, documented procedures, interaction between processes.',
    keywords: ['quality manual', 'scope of qms'],
    criticality: 'high',
  },
  {
    clause: '4.2.3',
    title: 'Medical device file',
    section: 'Quality Management System',
    description: 'For each medical device type or family, establish and maintain a file with documents generated or referenced to demonstrate conformity.',
    keywords: ['medical device file', 'device file', 'technical file', 'technical documentation', 'dhf', 'design history file'],
    criticality: 'critical',
  },
  {
    clause: '4.2.4',
    title: 'Control of documents',
    section: 'Quality Management System',
    description: 'Document control procedure for approval, review, update, identification of changes, availability, legibility, prevention of unintended use of obsolete documents.',
    keywords: ['document control', 'document approval', 'document review', 'version control', 'obsolete document'],
    criticality: 'high',
  },
  {
    clause: '4.2.5',
    title: 'Control of records',
    section: 'Quality Management System',
    description: 'Records shall remain legible, readily identifiable and retrievable. Documented procedure for identification, storage, security, retrieval, retention, disposition.',
    keywords: ['record control', 'record retention', 'record storage', 'record identification', 'data retention'],
    criticality: 'high',
  },

  // --- Section 5: Management responsibility ---
  {
    clause: '5.1',
    title: 'Management commitment',
    section: 'Management Responsibility',
    description: 'Top management shall provide evidence of commitment: communicating importance, quality policy, quality objectives, management reviews, resources.',
    keywords: ['management commitment', 'top management', 'leadership commitment'],
    criticality: 'medium',
  },
  {
    clause: '5.2',
    title: 'Customer focus',
    section: 'Management Responsibility',
    description: 'Top management shall ensure customer requirements and applicable regulatory requirements are determined and met.',
    keywords: ['customer focus', 'customer requirements', 'user needs', 'intended use'],
    criticality: 'medium',
  },
  {
    clause: '5.3',
    title: 'Quality policy',
    section: 'Management Responsibility',
    description: 'Top management shall ensure the quality policy is appropriate, includes commitment to comply, is communicated, understood, and reviewed.',
    keywords: ['quality policy'],
    criticality: 'medium',
  },
  {
    clause: '5.4',
    title: 'Planning',
    section: 'Management Responsibility',
    description: 'Quality objectives established at relevant functions. QMS planning to meet objectives and maintain QMS integrity during changes.',
    keywords: ['quality objectives', 'quality planning', 'qms planning'],
    criticality: 'medium',
  },
  {
    clause: '5.5',
    title: 'Responsibility, authority and communication',
    section: 'Management Responsibility',
    description: 'Define and communicate responsibilities and authorities. Appoint management representative. Ensure internal communication.',
    keywords: ['management representative', 'responsibility', 'authority', 'organizational chart', 'internal communication'],
    criticality: 'medium',
  },
  {
    clause: '5.6',
    title: 'Management review',
    section: 'Management Responsibility',
    description: 'Review the QMS at planned intervals. Inputs include audit results, customer feedback, process performance, CAPA status. Outputs include improvement actions.',
    keywords: ['management review', 'management review input', 'management review output', 'qms review'],
    criticality: 'high',
  },

  // --- Section 6: Resource management ---
  {
    clause: '6.1',
    title: 'Provision of resources',
    section: 'Resource Management',
    description: 'Determine and provide resources needed to implement, maintain QMS and meet regulatory and customer requirements.',
    keywords: ['resource management', 'provision of resources', 'resource allocation'],
    criticality: 'medium',
  },
  {
    clause: '6.2',
    title: 'Human resources',
    section: 'Resource Management',
    description: 'Personnel performing work affecting product quality shall be competent on basis of education, training, skills, experience. Maintain training records.',
    keywords: ['human resources', 'competence', 'training', 'training record', 'personnel qualification', 'competency assessment'],
    criticality: 'high',
  },
  {
    clause: '6.3',
    title: 'Infrastructure',
    section: 'Resource Management',
    description: 'Determine, provide and maintain infrastructure needed: buildings, workspace, process equipment, supporting services.',
    keywords: ['infrastructure', 'facility', 'equipment', 'workspace', 'maintenance'],
    criticality: 'medium',
  },
  {
    clause: '6.4',
    title: 'Work environment and contamination control',
    section: 'Resource Management',
    description: 'Determine and manage work environment needed. Document requirements for health, cleanliness, clothing if contact could affect product quality.',
    keywords: ['work environment', 'contamination control', 'cleanroom', 'clean room', 'environmental monitoring', 'environmental control'],
    criticality: 'high',
  },

  // --- Section 7: Product realization ---
  {
    clause: '7.1',
    title: 'Planning of product realization',
    section: 'Product Realization',
    description: 'Plan and develop the processes needed for product realization. Determine quality objectives, processes, documents, resources, V&V, monitoring, criteria.',
    keywords: ['product realization', 'realization planning', 'quality plan', 'project plan'],
    criticality: 'high',
  },
  {
    clause: '7.2',
    title: 'Customer-related processes',
    section: 'Product Realization',
    description: 'Determine product requirements (specified, regulatory, intended use). Review requirements. Customer communication.',
    keywords: ['customer requirements', 'product requirements', 'regulatory requirements', 'intended use', 'contract review'],
    criticality: 'high',
  },
  {
    clause: '7.3',
    title: 'Design and development',
    section: 'Product Realization',
    description: 'Design planning, inputs, outputs, review, verification, validation, transfer, changes, design history file. Covers 7.3.1 through 7.3.10.',
    keywords: ['design control', 'design input', 'design output', 'design review', 'design verification', 'design validation', 'design transfer', 'design change', 'design history', 'dhf', 'v&v'],
    criticality: 'critical',
  },
  {
    clause: '7.4',
    title: 'Purchasing',
    section: 'Product Realization',
    description: 'Purchasing process, purchasing information, verification of purchased product. Supplier evaluation and selection.',
    keywords: ['purchasing', 'supplier', 'vendor', 'supplier evaluation', 'supplier qualification', 'incoming inspection', 'approved supplier'],
    criticality: 'high',
  },
  {
    clause: '7.5',
    title: 'Production and service provision',
    section: 'Product Realization',
    description: 'Control of production, cleanliness, installation, servicing, special requirements for sterile medical devices, process validation, identification, traceability, product preservation.',
    keywords: ['production control', 'manufacturing', 'process validation', 'sterilization', 'traceability', 'identification', 'preservation', 'batch record', 'labeling', 'udi'],
    criticality: 'critical',
  },
  {
    clause: '7.6',
    title: 'Control of monitoring and measuring equipment',
    section: 'Product Realization',
    description: 'Determine monitoring and measurement, equipment needed. Calibrate or verify at specified intervals. Maintain calibration records.',
    keywords: ['calibration', 'measuring equipment', 'monitoring equipment', 'measurement', 'calibration record', 'metrolog'],
    criticality: 'high',
  },

  // --- Section 8: Measurement, analysis and improvement ---
  {
    clause: '8.1',
    title: 'Measurement, analysis and improvement — General',
    section: 'Measurement & Improvement',
    description: 'Plan and implement monitoring, measurement, analysis and improvement processes. Applicable statistical techniques.',
    keywords: ['measurement', 'analysis', 'improvement', 'statistical technique', 'data analysis'],
    criticality: 'medium',
  },
  {
    clause: '8.2',
    title: 'Monitoring and measurement',
    section: 'Measurement & Improvement',
    description: 'Customer feedback, complaint handling, regulatory reporting, internal audit, process monitoring, product monitoring.',
    keywords: ['internal audit', 'customer feedback', 'complaint', 'complaint handling', 'adverse event', 'vigilance', 'post-market', 'monitoring', 'audit'],
    criticality: 'critical',
  },
  {
    clause: '8.3',
    title: 'Control of nonconforming product',
    section: 'Measurement & Improvement',
    description: 'Ensure nonconforming product is identified and controlled to prevent unintended use or delivery. Rework, concession, investigation.',
    keywords: ['nonconforming', 'non-conforming', 'nonconformance', 'ncr', 'deviation', 'reject', 'rework', 'concession'],
    criticality: 'critical',
  },
  {
    clause: '8.4',
    title: 'Analysis of data',
    section: 'Measurement & Improvement',
    description: 'Determine, collect and analyze data to demonstrate suitability and effectiveness. Customer feedback, conformity, trends, suppliers.',
    keywords: ['data analysis', 'trend analysis', 'statistical analysis', 'kpi', 'metrics', 'performance indicator'],
    criticality: 'high',
  },
  {
    clause: '8.5',
    title: 'Improvement',
    section: 'Measurement & Improvement',
    description: 'Continual improvement. Corrective action procedure. Preventive action procedure (CAPA). Investigate causes, determine actions, verify effectiveness.',
    keywords: ['capa', 'corrective action', 'preventive action', 'corrective and preventive', 'root cause', 'effectiveness check', 'continual improvement'],
    criticality: 'critical',
  },
];

/**
 * Group clauses by their top-level section.
 */
export function clausesBySection(): Map<string, ISO13485Clause[]> {
  const map = new Map<string, ISO13485Clause[]>();
  for (const c of ISO_13485_CLAUSES) {
    const list = map.get(c.section) ?? [];
    list.push(c);
    map.set(c.section, list);
  }
  return map;
}

/**
 * Static (non-AI) gap assessment: match project requirements against ISO 13485 clauses
 * using keyword matching. Returns a status for each clause.
 */
export function staticGapAssessment(
  requirements: { id: string; title: string; description: string }[],
): { clause: ISO13485Clause; status: 'covered' | 'partial' | 'gap'; matchedReqIds: string[] }[] {
  return ISO_13485_CLAUSES.map((clause) => {
    const matchedReqIds: string[] = [];

    for (const req of requirements) {
      const text = `${req.title} ${req.description}`.toLowerCase();
      const hits = clause.keywords.filter((kw) => text.includes(kw));
      if (hits.length > 0) {
        matchedReqIds.push(req.id);
      }
    }

    let status: 'covered' | 'partial' | 'gap';
    if (matchedReqIds.length >= 2) {
      status = 'covered';
    } else if (matchedReqIds.length === 1) {
      status = 'partial';
    } else {
      status = 'gap';
    }

    return { clause, status, matchedReqIds };
  });
}
