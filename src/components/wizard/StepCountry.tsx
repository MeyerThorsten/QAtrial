import { useState } from 'react';
import { Search, Sparkles, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_REGISTRY } from '../../templates/registry';
import { DEMO_COUNTRY_CODES, getDemoProject } from '../../lib/demoProjects';
import type { DemoProject } from '../../lib/demoProjects';

interface Props {
  selected: string | null;
  onSelect: (code: string) => void;
  onNext: () => void;
  onLoadDemo?: (demo: DemoProject) => void;
}

const REGION_LABELS: Record<string, string> = {
  americas: 'Americas',
  europe: 'Europe',
  asia: 'Asia-Pacific',
};

const REGION_ORDER = ['americas', 'europe', 'asia'] as const;

export function StepCountry({ selected, onSelect, onNext, onLoadDemo }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null);

  const filtered = COUNTRY_REGISTRY.filter((c) => {
    if (!search.trim()) return true;
    const name = t('countries.' + c.code).toLowerCase();
    return name.includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
  });

  const grouped = REGION_ORDER.map((region) => ({
    region,
    label: REGION_LABELS[region],
    countries: filtered.filter((c) => c.region === region),
  })).filter((g) => g.countries.length > 0);

  const selectedDemo = selected ? getDemoProject(selected) : undefined;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">{t('wizard.selectCountry')}</h2>
        <p className="text-sm text-text-tertiary">{t('wizard.selectCountryDesc')}</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          placeholder={t('wizard.selectCountrySearch')}
        />
      </div>

      {/* Country list */}
      <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
        {grouped.map((group) => (
          <div key={group.region}>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 sticky top-0 bg-surface py-1 z-10">
              {group.label}
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {group.countries.map((country) => {
                const isSelected = selected === country.code;
                const hasDemo = DEMO_COUNTRY_CODES.has(country.code);
                const demo = hasDemo ? getDemoProject(country.code) : undefined;
                const isHovered = hoveredDemo === country.code;

                return (
                  <div key={country.code} className="relative">
                    <button
                      onClick={() => onSelect(country.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-accent bg-accent-subtle'
                          : 'border-transparent hover:bg-surface-hover'
                      }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className={`flex-1 text-sm font-medium ${isSelected ? 'text-accent-text' : 'text-text-primary'}`}>
                        {t('countries.' + country.code)}
                      </span>

                      {/* Demo badge */}
                      {hasDemo && (
                        <span
                          className="relative inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 cursor-help"
                          onMouseEnter={() => setHoveredDemo(country.code)}
                          onMouseLeave={() => setHoveredDemo(null)}
                        >
                          <Sparkles className="w-3 h-3" />
                          Demo
                        </span>
                      )}

                      <span className="text-xs text-text-tertiary">
                        {country.availableVerticals.length} {country.availableVerticals.length === 1 ? 'vertical' : 'verticals'}
                      </span>
                    </button>

                    {/* Demo tooltip */}
                    {hasDemo && isHovered && demo && (
                      <div className="absolute right-0 top-full mt-1 z-30 w-72 p-3 bg-surface border border-border rounded-xl shadow-lg text-xs">
                        <div className="font-semibold text-text-primary mb-1">
                          {t('wizard.demoAvailable')}
                        </div>
                        <div className="text-text-secondary">
                          {demo.companyName} — {demo.projectName}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <p className="text-sm text-text-tertiary text-center py-6">{t('common.noData')}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 gap-3">
        {/* Load Demo button — only visible when a country with demo is selected */}
        <div>
          {selectedDemo && onLoadDemo && (
            <button
              onClick={() => onLoadDemo(selectedDemo)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            >
              <Play className="w-4 h-4" />
              {t('wizard.loadDemo')}
            </button>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!selected}
          className="px-6 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
