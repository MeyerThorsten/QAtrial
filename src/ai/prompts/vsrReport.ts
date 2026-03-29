import type { ProjectMeta, Requirement, Test, ReportSection } from '../../types';
import { complete } from '../client';

/**
 * Generates a complete Validation Summary Report (VSR) with 7 sections.
 * Sections that are data-driven are built from the project data directly.
 * Sections that require narrative are generated via the AI provider.
 */
export async function generateVSR(
  project: ProjectMeta,
  requirements: Requirement[],
  tests: Test[],
): Promise<ReportSection[]> {
  const totalReqs = requirements.length;
  const totalTests = tests.length;
  const coveredReqIds = new Set(tests.flatMap((t) => t.linkedRequirementIds));
  const coveredReqs = requirements.filter((r) => coveredReqIds.has(r.id)).length;
  const coveragePct = totalReqs > 0 ? ((coveredReqs / totalReqs) * 100).toFixed(1) : '0.0';
  const passedTests = tests.filter((t) => t.status === 'Passed').length;
  const failedTests = tests.filter((t) => t.status === 'Failed').length;
  const notRunTests = tests.filter((t) => t.status === 'Not Run').length;

  // --- Section 1: Executive Summary (AI-generated) ---
  const execSummaryPrompt = `You are a validation specialist writing an executive summary for a Validation Summary Report (VSR).

Project: ${project.name} (v${project.version})
Owner: ${project.owner}
Country: ${project.country || 'Not specified'}
Vertical: ${project.vertical || 'general'}
Description: ${project.description}

Metrics:
- ${totalReqs} requirements, ${coveredReqs} covered (${coveragePct}%)
- ${totalTests} tests: ${passedTests} passed, ${failedTests} failed, ${notRunTests} not run

Write a concise executive summary (150-200 words) that:
1. States the purpose and scope of validation
2. Summarizes overall compliance status
3. Highlights key findings
4. Provides a clear pass/fail recommendation

Use professional regulatory language. No markdown code blocks.`;

  const execSummaryResponse = await complete({
    prompt: execSummaryPrompt,
    purpose: 'report_narrative',
    maxTokens: 800,
    temperature: 0.3,
  });

  // --- Section 2: Scope & Approach (AI-generated) ---
  const scopePrompt = `You are a validation specialist writing the Scope & Approach section of a Validation Summary Report.

Project: ${project.name} (v${project.version})
Type: ${project.type}
Country: ${project.country || 'Not specified'}
Vertical: ${project.vertical || 'general'}
Description: ${project.description}
Total Requirements: ${totalReqs}
Total Test Cases: ${totalTests}

Write a Scope & Approach section (150-200 words) that:
1. Defines what is in scope and out of scope
2. Describes the validation approach (e.g., risk-based, requirements-driven)
3. References applicable regulatory standards
4. Lists the validation deliverables

Use professional regulatory language. No markdown code blocks.`;

  const scopeResponse = await complete({
    prompt: scopePrompt,
    purpose: 'report_narrative',
    maxTokens: 800,
    temperature: 0.3,
  });

  // --- Section 3: Traceability Matrix (data-driven) ---
  const traceRows = requirements.map((req) => {
    const linkedTests = tests.filter((t) => t.linkedRequirementIds.includes(req.id));
    const testList =
      linkedTests.length > 0
        ? linkedTests.map((t) => `${t.id} (${t.status})`).join(', ')
        : 'No linked tests';
    return `| ${req.id} | ${req.title} | ${req.status} | ${testList} |`;
  });

  const traceContent = `| Requirement ID | Title | Status | Linked Tests |
|---|---|---|---|
${traceRows.join('\n')}

Coverage: ${coveredReqs} of ${totalReqs} requirements covered (${coveragePct}%)`;

  // --- Section 4: Test Execution Summary (data-driven) ---
  const testExecContent = `Test Execution Summary
Total Tests: ${totalTests}
Passed: ${passedTests} (${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0'}%)
Failed: ${failedTests} (${totalTests > 0 ? ((failedTests / totalTests) * 100).toFixed(1) : '0.0'}%)
Not Run: ${notRunTests} (${totalTests > 0 ? ((notRunTests / totalTests) * 100).toFixed(1) : '0.0'}%)

| Test ID | Title | Status | Linked Requirements |
|---|---|---|---|
${tests
  .map(
    (t) =>
      `| ${t.id} | ${t.title} | ${t.status} | ${t.linkedRequirementIds.join(', ') || 'None'} |`,
  )
  .join('\n')}`;

  // --- Section 5: Risk Assessment (data-driven) ---
  const riskReqs = requirements.filter((r) => r.riskLevel);
  const riskCounts = {
    critical: riskReqs.filter((r) => r.riskLevel === 'critical').length,
    high: riskReqs.filter((r) => r.riskLevel === 'high').length,
    medium: riskReqs.filter((r) => r.riskLevel === 'medium').length,
    low: riskReqs.filter((r) => r.riskLevel === 'low').length,
  };
  const unassessedCount = requirements.filter((r) => !r.riskLevel).length;

  const riskContent = `Risk Assessment Summary
Assessed: ${riskReqs.length} of ${totalReqs} requirements
Unassessed: ${unassessedCount}

Risk Distribution:
- Critical: ${riskCounts.critical}
- High: ${riskCounts.high}
- Medium: ${riskCounts.medium}
- Low: ${riskCounts.low}

${
  riskCounts.critical > 0
    ? `Critical Risk Requirements:\n${riskReqs
        .filter((r) => r.riskLevel === 'critical')
        .map((r) => `- ${r.id}: ${r.title}`)
        .join('\n')}`
    : 'No critical risk requirements identified.'
}`;

  // --- Section 6: Deviations & CAPA (AI-generated) ---
  const failedTestsList = tests
    .filter((t) => t.status === 'Failed')
    .map((t) => `- ${t.id}: ${t.title} (linked to: ${t.linkedRequirementIds.join(', ') || 'none'})`)
    .join('\n');

  const deviationPrompt = `You are a validation specialist writing the Deviations & CAPA section of a Validation Summary Report.

Project: ${project.name}
Failed Tests:
${failedTestsList || 'No failed tests.'}

Write a Deviations & CAPA section (100-150 words) that:
1. Lists any deviations identified during testing
2. For each deviation, recommends whether CAPA is required
3. If no deviations exist, state that no deviations were identified
4. Notes any observations or recommendations

Use professional regulatory language. No markdown code blocks.`;

  const deviationResponse = await complete({
    prompt: deviationPrompt,
    purpose: 'report_narrative',
    maxTokens: 600,
    temperature: 0.3,
  });

  // --- Section 7: Conclusion (AI-generated) ---
  const conclusionPrompt = `You are a validation specialist writing the Conclusion section of a Validation Summary Report.

Project: ${project.name} (v${project.version})
Coverage: ${coveragePct}%
Tests: ${passedTests} passed, ${failedTests} failed, ${notRunTests} not run
Critical Risks: ${riskCounts.critical}
High Risks: ${riskCounts.high}

Write a conclusion (100-150 words) that:
1. Provides a clear overall validation status
2. States whether the system is fit for intended use
3. Lists any conditions or caveats
4. Provides a recommendation (approve / conditional approve / reject)

Use professional regulatory language. No markdown code blocks.`;

  const conclusionResponse = await complete({
    prompt: conclusionPrompt,
    purpose: 'report_narrative',
    maxTokens: 600,
    temperature: 0.3,
  });

  return [
    {
      title: 'Executive Summary',
      content: execSummaryResponse.text,
      aiGenerated: true,
    },
    {
      title: 'Scope & Approach',
      content: scopeResponse.text,
      aiGenerated: true,
    },
    {
      title: 'Traceability Matrix',
      content: traceContent,
      aiGenerated: false,
    },
    {
      title: 'Test Execution Summary',
      content: testExecContent,
      aiGenerated: false,
    },
    {
      title: 'Risk Assessment',
      content: riskContent,
      aiGenerated: false,
    },
    {
      title: 'Deviations & CAPA',
      content: deviationResponse.text,
      aiGenerated: true,
    },
    {
      title: 'Conclusion',
      content: conclusionResponse.text,
      aiGenerated: true,
    },
  ];
}
