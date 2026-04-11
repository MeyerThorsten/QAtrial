import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { findAccessibleProject } from '../lib/projectAccess.js';
import { authMiddleware, getUser, requirePermission } from '../middleware/auth.js';
import { logAudit } from '../services/audit.service.js';

const etmf = new Hono();

etmf.use('*', authMiddleware);

// ── TMF Reference Model v3.3 Structure ────────────────────────────────────────

interface SectionDef {
  number: string;
  name: string;
  artifacts: string[];
}

interface ZoneDef {
  number: number;
  name: string;
  sections: SectionDef[];
}

const TMF_REFERENCE_MODEL: ZoneDef[] = [
  {
    number: 1,
    name: 'Trial Management',
    sections: [
      { number: '01.01', name: 'Trial Master File Index', artifacts: ['TMF Index', 'TMF Plan', 'TMF Transfer Plan'] },
      { number: '01.02', name: 'Trial Management Plan', artifacts: ['Clinical Trial Protocol Synopsis', 'Project Management Plan', 'Communication Plan', 'Risk Management Plan'] },
      { number: '01.03', name: 'Trial Team Information', artifacts: ['Organisation Chart', 'Contact List', 'Trial Team CVs', 'Delegation of Authority Log'] },
      { number: '01.04', name: 'Trial Status Reports', artifacts: ['Enrolment Status Report', 'Trial Status Report', 'Interim Analysis Report'] },
      { number: '01.05', name: 'Meeting Materials', artifacts: ['Kick-off Meeting Minutes', 'Team Meeting Minutes', 'Investigator Meeting Minutes', 'Steering Committee Minutes'] },
      { number: '01.06', name: 'Operational Correspondence', artifacts: ['General Correspondence Log', 'Sponsor Correspondence', 'CRO Correspondence'] },
      { number: '01.07', name: 'Filing and Archiving', artifacts: ['Filing Instructions', 'Archiving Records', 'Retention Schedule'] },
      { number: '01.08', name: 'Audit and Inspection', artifacts: ['Audit Certificate', 'Audit Plan', 'Audit Report', 'CAPA Log', 'Inspection Notification', 'Inspection Report'] },
    ],
  },
  {
    number: 2,
    name: 'Central Trial Documents',
    sections: [
      { number: '02.01', name: 'Protocol', artifacts: ['Protocol', 'Protocol Amendment(s)', 'Protocol Signature Page', 'Summary of Changes'] },
      { number: '02.02', name: 'Sample Case Report Form', artifacts: ['Annotated CRF', 'Blank CRF', 'CRF Completion Guidelines'] },
      { number: '02.03', name: 'Investigator Brochure', artifacts: ['Investigator Brochure', 'IB Update/Supplement', 'IB Acknowledgement'] },
      { number: '02.04', name: 'Informed Consent', artifacts: ['Master Informed Consent Form', 'Assent Form', 'ICF Translations', 'ICF Version Tracking Log'] },
      { number: '02.05', name: 'Insurance/Indemnity', artifacts: ['Insurance Certificate', 'Indemnity Agreement', 'Subject Injury Compensation'] },
      { number: '02.06', name: 'Agreements', artifacts: ['CRO Agreement', 'Vendor Agreements', 'Confidentiality Agreements', 'Financial Disclosure'] },
      { number: '02.07', name: 'Subject Information', artifacts: ['Subject Identification Log', 'Subject Screening Log', 'Randomisation List', 'Enrolment Log'] },
      { number: '02.08', name: 'Data Management', artifacts: ['Data Management Plan', 'Database Design Document', 'Data Validation Plan', 'Medical Coding Plan', 'Data Review Plan'] },
      { number: '02.09', name: 'Statistical Analysis', artifacts: ['Statistical Analysis Plan', 'Randomisation Plan', 'Interim Analysis Plan'] },
      { number: '02.10', name: 'Publications', artifacts: ['Publication Policy', 'Manuscript', 'Abstracts'] },
    ],
  },
  {
    number: 3,
    name: 'Regulatory',
    sections: [
      { number: '03.01', name: 'Regulatory Authority Applications', artifacts: ['Clinical Trial Application', 'IND Application', 'Regulatory Authority Approval Letter', 'Annual Safety Report'] },
      { number: '03.02', name: 'Product Documentation', artifacts: ['Investigator Brochure Updates', 'Product Characterisation', 'Product Specifications', 'Manufacturing Information'] },
      { number: '03.03', name: 'Regulatory Correspondence', artifacts: ['Regulatory Authority Correspondence', 'Agency Meeting Minutes', 'Scientific Advice Documentation'] },
      { number: '03.04', name: 'Regulatory Notifications', artifacts: ['Safety Update Reports', 'Protocol Amendment Notifications', 'End of Trial Notification', 'Substantial Amendment Notifications'] },
      { number: '03.05', name: 'Safety Reporting to Authorities', artifacts: ['SUSAR Reports', 'DSUR/Development Safety Update Report', 'IND Safety Reports', 'Annual Safety Reports'] },
      { number: '03.06', name: 'Regulatory Compliance', artifacts: ['GCP Compliance Statement', 'Regulatory Commitments Tracker', 'Regulatory Audit Findings'] },
    ],
  },
  {
    number: 4,
    name: 'IRB/IEC',
    sections: [
      { number: '04.01', name: 'IRB/IEC Composition', artifacts: ['IRB/IEC Composition List', 'IRB/IEC Charter', 'IRB/IEC SOPs', 'Compliance with GCP Statement'] },
      { number: '04.02', name: 'IRB/IEC Approvals', artifacts: ['Initial IRB/IEC Approval', 'Amendment Approvals', 'Continuing Review Approval', 'Informed Consent Approval'] },
      { number: '04.03', name: 'IRB/IEC Correspondence', artifacts: ['IRB/IEC Submission Cover Letter', 'IRB/IEC Response Letters', 'Annual/Periodic Reports to IRB/IEC'] },
      { number: '04.04', name: 'IRB/IEC Notifications', artifacts: ['SAE Notifications to IRB/IEC', 'Protocol Deviation Reports', 'Study Closure Report', 'Safety Reports to IRB/IEC'] },
      { number: '04.05', name: 'Subject Complaints', artifacts: ['Subject Complaint Log', 'Complaint Investigation Reports', 'Resolution Documentation'] },
    ],
  },
  {
    number: 5,
    name: 'Site Management',
    sections: [
      { number: '05.01', name: 'Site Selection', artifacts: ['Site Feasibility Questionnaire', 'Site Assessment Report', 'Site Selection Visit Report', 'Pre-Study Visit Report'] },
      { number: '05.02', name: 'Site Setup', artifacts: ['Site Initiation Visit Report', 'Site Activation Checklist', 'Site Training Records', 'Delegation Log'] },
      { number: '05.03', name: 'Site Monitoring', artifacts: ['Monitoring Visit Plan', 'Monitoring Visit Report', 'Follow-up Letter', 'Confirmation of Monitoring Visit', 'Source Data Verification Log'] },
      { number: '05.04', name: 'Site Close-Out', artifacts: ['Close-Out Visit Report', 'Final Site File Reconciliation', 'Drug Accountability Log', 'IP Return/Destruction Records'] },
      { number: '05.05', name: 'Investigator Documents', artifacts: ['Investigator CV', 'Medical Licence', 'Financial Disclosure Form', 'Confidentiality Agreement'] },
      { number: '05.06', name: 'Site Staff', artifacts: ['Site Staff CVs', 'Site Staff Training Records', 'GCP Training Certificates', 'Protocol-Specific Training'] },
      { number: '05.07', name: 'Lab Documentation', artifacts: ['Lab Certification', 'Lab Normal Ranges', 'Lab Accreditation', 'Specimen Handling Manual'] },
      { number: '05.08', name: 'Site Correspondence', artifacts: ['Site Correspondence Log', 'Sponsor-Site Letters', 'Newsletter Communications'] },
    ],
  },
  {
    number: 6,
    name: 'IP and Trial Supplies',
    sections: [
      { number: '06.01', name: 'IP Management', artifacts: ['IP Handling Manual', 'IP Label Text', 'Randomisation Code Envelopes', 'Code Break Procedures'] },
      { number: '06.02', name: 'IP Manufacture/Formulation', artifacts: ['Certificate of Analysis', 'Manufacturing Batch Records', 'Stability Data', 'GMP Certification'] },
      { number: '06.03', name: 'IP Shipping and Storage', artifacts: ['IP Shipment Records', 'Temperature Monitoring Logs', 'IP Receipt Confirmation', 'IP Inventory Log'] },
      { number: '06.04', name: 'IP Accountability', artifacts: ['IP Dispensing Log', 'IP Return Log', 'Drug Accountability Log', 'IP Destruction Certificate'] },
      { number: '06.05', name: 'IP Recall/Return', artifacts: ['IP Recall Notice', 'IP Return Instructions', 'IP Return Shipping Records'] },
      { number: '06.06', name: 'Comparator/Concomitant Therapy', artifacts: ['Comparator Drug Documentation', 'Concomitant Medication List', 'Prohibited Medication List'] },
    ],
  },
  {
    number: 7,
    name: 'Safety Reporting',
    sections: [
      { number: '07.01', name: 'Safety Management Plan', artifacts: ['Safety Management Plan', 'Safety Reporting Flowchart', 'SAE Reconciliation Plan', 'DSMB Charter'] },
      { number: '07.02', name: 'Adverse Event Reports', artifacts: ['SAE Reports', 'AE Listings', 'AE Narratives', 'Expedited Safety Reports'] },
      { number: '07.03', name: 'SUSAR Reporting', artifacts: ['SUSAR Line Listings', 'SUSAR Narratives', 'SUSAR Distribution Records'] },
      { number: '07.04', name: 'Safety Data Review', artifacts: ['DSMB Meeting Minutes', 'DSMB Recommendations', 'Safety Review Committee Minutes', 'Unblinding Documentation'] },
      { number: '07.05', name: 'Periodic Safety Reports', artifacts: ['DSUR/Development Safety Update Report', 'Annual Safety Report', 'PSUR/Periodic Safety Update Report', 'Benefit-Risk Assessment'] },
      { number: '07.06', name: 'Safety Database', artifacts: ['Safety Database Specifications', 'MedDRA Coding Dictionary', 'Safety Data Lock Documentation'] },
    ],
  },
  {
    number: 8,
    name: 'Centralised and Specialist',
    sections: [
      { number: '08.01', name: 'Central Laboratory', artifacts: ['Central Lab Manual', 'Central Lab Certificates', 'Lab Kit Instructions', 'Sample Requisition Forms'] },
      { number: '08.02', name: 'eClinical Systems', artifacts: ['EDC Specification', 'EDC User Acceptance Testing', 'EDC Validation', 'IWRS/IRT System Documentation', 'ePRO System Documentation'] },
      { number: '08.03', name: 'Imaging/ECG', artifacts: ['Central ECG Manual', 'Central Imaging Manual', 'ECG/Imaging Reading Reports', 'Equipment Calibration Records'] },
      { number: '08.04', name: 'Bioanalytical/PK', artifacts: ['Bioanalytical Method Validation', 'PK Analysis Plan', 'PK Analysis Report', 'Sample Manifest'] },
      { number: '08.05', name: 'Genetics/Biomarker', artifacts: ['Genetic Research Consent', 'Biomarker Analysis Plan', 'Biobank Documentation', 'Sample Storage/Tracking'] },
      { number: '08.06', name: 'Clinical Outcome Assessments', artifacts: ['COA Strategy Document', 'Validated Questionnaires', 'Translation/Linguistic Validation', 'Licensing Agreements for PROs'] },
    ],
  },
];

// Initialize TMF for a project
etmf.post('/:projectId/initialize', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    // Check if already initialized
    const existingZones = await prisma.tMFZone.findMany({ where: { projectId } });
    if (existingZones.length > 0) {
      return c.json({ message: 'TMF already initialized for this project' }, 400);
    }

    // Create all zones, sections, and artifacts
    for (const zoneDef of TMF_REFERENCE_MODEL) {
      const zone = await prisma.tMFZone.create({
        data: {
          projectId,
          number: zoneDef.number,
          name: zoneDef.name,
        },
      });

      for (const sectionDef of zoneDef.sections) {
        const section = await prisma.tMFSection.create({
          data: {
            zoneId: zone.id,
            number: sectionDef.number,
            name: sectionDef.name,
          },
        });

        for (const artifactName of sectionDef.artifacts) {
          await prisma.tMFArtifact.create({
            data: {
              sectionId: section.id,
              name: artifactName,
              status: 'expected',
            },
          });
        }
      }
    }

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'create',
      entityType: 'tmf',
      entityId: projectId,
      newValue: { action: 'initialize_tmf' },
    });

    return c.json({ message: 'TMF initialized successfully', zones: TMF_REFERENCE_MODEL.length }, 201);
  } catch (error: any) {
    console.error('Initialize TMF error:', error);
    return c.json({ message: 'Failed to initialize TMF' }, 500);
  }
});

// List zones with section counts and completeness
etmf.get('/:projectId/zones', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const zones = await prisma.tMFZone.findMany({
      where: { projectId },
      include: {
        sections: {
          include: {
            artifacts: true,
          },
        },
      },
      orderBy: { number: 'asc' },
    });

    const zonesWithStats = zones.map((zone) => {
      const allArtifacts = zone.sections.flatMap((s) => s.artifacts);
      const total = allArtifacts.length;
      const applicable = allArtifacts.filter((a) => a.status !== 'not_applicable').length;
      const uploaded = allArtifacts.filter((a) => a.status === 'uploaded' || a.status === 'approved').length;
      const approved = allArtifacts.filter((a) => a.status === 'approved').length;
      const completeness = applicable > 0 ? Math.round((uploaded / applicable) * 100) : 100;

      return {
        id: zone.id,
        number: zone.number,
        name: zone.name,
        sectionCount: zone.sections.length,
        artifactCount: total,
        uploaded,
        approved,
        notApplicable: total - applicable,
        completeness,
      };
    });

    return c.json({ zones: zonesWithStats });
  } catch (error: any) {
    console.error('List TMF zones error:', error);
    return c.json({ message: 'Failed to list TMF zones' }, 500);
  }
});

// List sections with artifact counts
etmf.get('/:projectId/zones/:zoneId/sections', async (c) => {
  try {
    const user = getUser(c);
    const { projectId, zoneId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const sections = await prisma.tMFSection.findMany({
      where: { zoneId },
      include: { artifacts: true },
      orderBy: { number: 'asc' },
    });

    const sectionsWithStats = sections.map((section) => {
      const total = section.artifacts.length;
      const applicable = section.artifacts.filter((a) => a.status !== 'not_applicable').length;
      const uploaded = section.artifacts.filter((a) => a.status === 'uploaded' || a.status === 'approved').length;
      const approved = section.artifacts.filter((a) => a.status === 'approved').length;
      const completeness = applicable > 0 ? Math.round((uploaded / applicable) * 100) : 100;

      return {
        id: section.id,
        number: section.number,
        name: section.name,
        artifactCount: total,
        uploaded,
        approved,
        notApplicable: total - applicable,
        completeness,
      };
    });

    return c.json({ sections: sectionsWithStats });
  } catch (error: any) {
    console.error('List TMF sections error:', error);
    return c.json({ message: 'Failed to list TMF sections' }, 500);
  }
});

// List artifacts for a section
etmf.get('/:projectId/sections/:sectionId/artifacts', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();
    const { sectionId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const artifacts = await prisma.tMFArtifact.findMany({
      where: { sectionId },
      orderBy: { name: 'asc' },
    });

    return c.json({ artifacts });
  } catch (error: any) {
    console.error('List TMF artifacts error:', error);
    return c.json({ message: 'Failed to list TMF artifacts' }, 500);
  }
});

// Upload file to artifact slot
etmf.post('/:projectId/artifacts/:artifactId/upload', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId, artifactId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const artifact = await prisma.tMFArtifact.findUnique({ where: { id: artifactId } });
    if (!artifact) return c.json({ message: 'Artifact not found' }, 404);

    const body = await c.req.json();
    const { fileName, fileSize, storagePath } = body;

    if (!fileName) {
      return c.json({ message: 'fileName is required' }, 400);
    }

    const updated = await prisma.tMFArtifact.update({
      where: { id: artifactId },
      data: {
        fileName,
        fileSize: fileSize ?? 0,
        storagePath: storagePath ?? `/uploads/tmf/${projectId}/${artifactId}/${fileName}`,
        status: 'uploaded',
        uploadedBy: user.userId,
        uploadedAt: new Date(),
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'tmf_artifact',
      entityId: artifactId,
      previousValue: { status: artifact.status },
      newValue: { status: 'uploaded', fileName },
    });

    return c.json({ artifact: updated });
  } catch (error: any) {
    console.error('Upload TMF artifact error:', error);
    return c.json({ message: 'Failed to upload artifact' }, 500);
  }
});

// Approve artifact
etmf.put('/:projectId/artifacts/:artifactId/approve', requirePermission('canApprove'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId, artifactId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const artifact = await prisma.tMFArtifact.findUnique({ where: { id: artifactId } });
    if (!artifact) return c.json({ message: 'Artifact not found' }, 404);

    if (artifact.status !== 'uploaded') {
      return c.json({ message: 'Only uploaded artifacts can be approved' }, 400);
    }

    const updated = await prisma.tMFArtifact.update({
      where: { id: artifactId },
      data: {
        status: 'approved',
        approvedBy: user.userId,
        approvedAt: new Date(),
      },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'approve',
      entityType: 'tmf_artifact',
      entityId: artifactId,
      previousValue: { status: 'uploaded' },
      newValue: { status: 'approved' },
    });

    return c.json({ artifact: updated });
  } catch (error: any) {
    console.error('Approve TMF artifact error:', error);
    return c.json({ message: 'Failed to approve artifact' }, 500);
  }
});

// Mark artifact as not applicable
etmf.put('/:projectId/artifacts/:artifactId/na', requirePermission('canEdit'), async (c) => {
  try {
    const user = getUser(c);
    const { projectId, artifactId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const artifact = await prisma.tMFArtifact.findUnique({ where: { id: artifactId } });
    if (!artifact) return c.json({ message: 'Artifact not found' }, 404);

    const updated = await prisma.tMFArtifact.update({
      where: { id: artifactId },
      data: { status: 'not_applicable' },
    });

    await logAudit({
      projectId,
      userId: user.userId,
      action: 'update',
      entityType: 'tmf_artifact',
      entityId: artifactId,
      previousValue: { status: artifact.status },
      newValue: { status: 'not_applicable' },
    });

    return c.json({ artifact: updated });
  } catch (error: any) {
    console.error('Mark TMF artifact N/A error:', error);
    return c.json({ message: 'Failed to update artifact' }, 500);
  }
});

// Overall completeness
etmf.get('/:projectId/completeness', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const zones = await prisma.tMFZone.findMany({
      where: { projectId },
      include: {
        sections: {
          include: { artifacts: true },
        },
      },
      orderBy: { number: 'asc' },
    });

    const allArtifacts = zones.flatMap((z) => z.sections.flatMap((s) => s.artifacts));
    const total = allArtifacts.length;
    const applicable = allArtifacts.filter((a) => a.status !== 'not_applicable').length;
    const uploaded = allArtifacts.filter((a) => a.status === 'uploaded' || a.status === 'approved').length;
    const approved = allArtifacts.filter((a) => a.status === 'approved').length;
    const overallCompleteness = applicable > 0 ? Math.round((uploaded / applicable) * 100) : 100;

    const perZone = zones.map((zone) => {
      const zoneArtifacts = zone.sections.flatMap((s) => s.artifacts);
      const zTotal = zoneArtifacts.length;
      const zApplicable = zoneArtifacts.filter((a) => a.status !== 'not_applicable').length;
      const zUploaded = zoneArtifacts.filter((a) => a.status === 'uploaded' || a.status === 'approved').length;
      const zApproved = zoneArtifacts.filter((a) => a.status === 'approved').length;

      return {
        zoneNumber: zone.number,
        zoneName: zone.name,
        total: zTotal,
        applicable: zApplicable,
        uploaded: zUploaded,
        approved: zApproved,
        completeness: zApplicable > 0 ? Math.round((zUploaded / zApplicable) * 100) : 100,
      };
    });

    return c.json({
      overall: { total, applicable, uploaded, approved, completeness: overallCompleteness },
      perZone,
    });
  } catch (error: any) {
    console.error('TMF completeness error:', error);
    return c.json({ message: 'Failed to calculate completeness' }, 500);
  }
});

// Inspection readiness score
etmf.get('/:projectId/inspection-readiness', async (c) => {
  try {
    const user = getUser(c);
    const { projectId } = c.req.param();

    const project = await findAccessibleProject(projectId, user.orgId);
    if (!project) return c.json({ message: 'Project not found' }, 404);

    const zones = await prisma.tMFZone.findMany({
      where: { projectId },
      include: {
        sections: {
          include: { artifacts: true },
        },
      },
    });

    const allArtifacts = zones.flatMap((z) => z.sections.flatMap((s) => s.artifacts));
    const applicable = allArtifacts.filter((a) => a.status !== 'not_applicable');
    const total = applicable.length;

    if (total === 0) {
      return c.json({
        score: 0,
        level: 'not_started',
        uploaded: 0,
        approved: 0,
        missing: 0,
        total: 0,
      });
    }

    const uploaded = applicable.filter((a) => a.status === 'uploaded' || a.status === 'approved').length;
    const approved = applicable.filter((a) => a.status === 'approved').length;
    const missing = total - uploaded;

    // Readiness score: 60% weight on upload completeness, 40% on approval status
    const uploadScore = (uploaded / total) * 60;
    const approvalScore = uploaded > 0 ? (approved / uploaded) * 40 : 0;
    const score = Math.round(uploadScore + approvalScore);

    let level: string;
    if (score >= 90) level = 'inspection_ready';
    else if (score >= 70) level = 'near_ready';
    else if (score >= 40) level = 'in_progress';
    else level = 'not_ready';

    return c.json({ score, level, uploaded, approved, missing, total });
  } catch (error: any) {
    console.error('TMF inspection readiness error:', error);
    return c.json({ message: 'Failed to calculate inspection readiness' }, 500);
  }
});

export default etmf;
