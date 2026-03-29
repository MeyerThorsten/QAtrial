import { ClipboardList, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TemplateRequirement, TemplateTest } from '../../templates/types';

interface Props {
  requirements: TemplateRequirement[];
  tests: TemplateTest[];
  selectedReqs: boolean[];
  selectedTests: boolean[];
  onToggleReq: (index: number) => void;
  onToggleTest: (index: number) => void;
  onBack: () => void;
  onCreate: () => void;
}

export function StepPreview({
  requirements,
  tests,
  selectedReqs,
  selectedTests,
  onToggleReq,
  onToggleTest,
  onBack,
  onCreate,
}: Props) {
  const { t } = useTranslation();

  const reqCount = selectedReqs.filter(Boolean).length;
  const testCount = selectedTests.filter(Boolean).length;

  const reqsByCategory = new Map<string, { index: number; title: string; description: string }[]>();
  requirements.forEach((req, i) => {
    const list = reqsByCategory.get(req.category) ?? [];
    list.push({ index: i, title: req.title, description: req.description });
    reqsByCategory.set(req.category, list);
  });

  const testsByCategory = new Map<string, { index: number; title: string; description: string }[]>();
  tests.forEach((test, i) => {
    const list = testsByCategory.get(test.category) ?? [];
    list.push({ index: i, title: test.title, description: test.description });
    testsByCategory.set(test.category, list);
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-1">{t('wizard.preview')}</h2>
      <p className="text-sm text-text-tertiary mb-4">
        {t('wizard.previewDesc', { reqCount: requirements.length, testCount: tests.length })}
      </p>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        <div>
          <div className="flex items-center gap-1.5 mb-2 sticky top-0 bg-surface py-1 z-10">
            <ClipboardList className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-text-primary">
              {t('wizard.previewReqs', { selected: reqCount, total: requirements.length })}
            </span>
          </div>
          {Array.from(reqsByCategory.entries()).map(([category, items]) => (
            <div key={category} className="mb-3">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1 ml-6">
                {category}
              </div>
              {items.map(({ index, title, description }) => (
                <label
                  key={index}
                  className="flex items-start gap-2 px-2 py-1.5 hover:bg-surface-hover rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedReqs[index]}
                    onChange={() => onToggleReq(index)}
                    className="mt-0.5 rounded border-input-border text-accent focus:ring-accent"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-primary">{title}</span>
                    <p className="text-xs text-text-tertiary truncate">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>

        <hr className="border-border" />

        <div>
          <div className="flex items-center gap-1.5 mb-2 sticky top-0 bg-surface py-1 z-10">
            <FlaskConical className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-text-primary">
              {t('wizard.previewTests', { selected: testCount, total: tests.length })}
            </span>
          </div>
          {Array.from(testsByCategory.entries()).map(([category, items]) => (
            <div key={category} className="mb-3">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1 ml-6">
                {category}
              </div>
              {items.map(({ index, title, description }) => (
                <label
                  key={index}
                  className="flex items-start gap-2 px-2 py-1.5 hover:bg-surface-hover rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTests[index]}
                    onChange={() => onToggleTest(index)}
                    className="mt-0.5 rounded border-input-border text-success focus:ring-success"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text-primary">{title}</span>
                    <p className="text-xs text-text-tertiary truncate">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border mt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onCreate}
          className="px-6 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
        >
          {t('wizard.createWithCounts', { reqCount, testCount })}
        </button>
      </div>
    </div>
  );
}
