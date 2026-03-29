import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '../../store/useLocaleStore';

interface LanguageOption {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
}

interface LanguageGroup {
  label: string;
  languages: LanguageOption[];
}

const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    label: 'Americas',
    languages: [
      { code: 'en', flag: '\u{1F1FA}\u{1F1F8}', nativeName: 'English', englishName: 'English' },
      { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', nativeName: 'Espa\u00f1ol', englishName: 'Spanish' },
      { code: 'fr-CA', flag: '\u{1F1E8}\u{1F1E6}', nativeName: 'Fran\u00e7ais', englishName: 'French (Canada)' },
    ],
  },
  {
    label: 'Europe',
    languages: [
      { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', nativeName: 'Deutsch', englishName: 'German' },
      { code: 'fr', flag: '\u{1F1EB}\u{1F1F7}', nativeName: 'Fran\u00e7ais', englishName: 'French' },
      { code: 'it', flag: '\u{1F1EE}\u{1F1F9}', nativeName: 'Italiano', englishName: 'Italian' },
      { code: 'pt', flag: '\u{1F1F5}\u{1F1F9}', nativeName: 'Portugu\u00eas', englishName: 'Portuguese' },
      { code: 'nl', flag: '\u{1F1F3}\u{1F1F1}', nativeName: 'Nederlands', englishName: 'Dutch' },
      { code: 'pl', flag: '\u{1F1F5}\u{1F1F1}', nativeName: 'Polski', englishName: 'Polish' },
      { code: 'sv', flag: '\u{1F1F8}\u{1F1EA}', nativeName: 'Svenska', englishName: 'Swedish' },
      { code: 'nb', flag: '\u{1F1F3}\u{1F1F4}', nativeName: 'Norsk', englishName: 'Norwegian' },
      { code: 'da', flag: '\u{1F1E9}\u{1F1F0}', nativeName: 'Dansk', englishName: 'Danish' },
      { code: 'fi', flag: '\u{1F1EB}\u{1F1EE}', nativeName: 'Suomi', englishName: 'Finnish' },
      { code: 'cs', flag: '\u{1F1E8}\u{1F1FF}', nativeName: '\u010Ce\u0161tina', englishName: 'Czech' },
      { code: 'ro', flag: '\u{1F1F7}\u{1F1F4}', nativeName: 'Rom\u00e2n\u0103', englishName: 'Romanian' },
      { code: 'hu', flag: '\u{1F1ED}\u{1F1FA}', nativeName: 'Magyar', englishName: 'Hungarian' },
      { code: 'el', flag: '\u{1F1EC}\u{1F1F7}', nativeName: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac', englishName: 'Greek' },
      { code: 'hr', flag: '\u{1F1ED}\u{1F1F7}', nativeName: 'Hrvatski', englishName: 'Croatian' },
      { code: 'bg', flag: '\u{1F1E7}\u{1F1EC}', nativeName: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438', englishName: 'Bulgarian' },
      { code: 'sk', flag: '\u{1F1F8}\u{1F1F0}', nativeName: 'Sloven\u010dina', englishName: 'Slovak' },
      { code: 'sl', flag: '\u{1F1F8}\u{1F1EE}', nativeName: 'Sloven\u0161\u010dina', englishName: 'Slovenian' },
      { code: 'et', flag: '\u{1F1EA}\u{1F1EA}', nativeName: 'Eesti', englishName: 'Estonian' },
      { code: 'lv', flag: '\u{1F1F1}\u{1F1FB}', nativeName: 'Latvie\u0161u', englishName: 'Latvian' },
      { code: 'lt', flag: '\u{1F1F1}\u{1F1F9}', nativeName: 'Lietuvi\u0173', englishName: 'Lithuanian' },
      { code: 'ga', flag: '\u{1F1EE}\u{1F1EA}', nativeName: 'Gaeilge', englishName: 'Irish' },
      { code: 'mt', flag: '\u{1F1F2}\u{1F1F9}', nativeName: 'Malti', englishName: 'Maltese' },
    ],
  },
  {
    label: 'Asia',
    languages: [
      { code: 'ja', flag: '\u{1F1EF}\u{1F1F5}', nativeName: '\u65e5\u672c\u8a9e', englishName: 'Japanese' },
      { code: 'zh-CN', flag: '\u{1F1E8}\u{1F1F3}', nativeName: '\u7b80\u4f53\u4e2d\u6587', englishName: 'Chinese (Simplified)' },
      { code: 'zh-TW', flag: '\u{1F1F9}\u{1F1FC}', nativeName: '\u7e41\u9ad4\u4e2d\u6587', englishName: 'Chinese (Traditional)' },
      { code: 'ko', flag: '\u{1F1F0}\u{1F1F7}', nativeName: '\ud55c\uad6d\uc5b4', englishName: 'Korean' },
      { code: 'hi', flag: '\u{1F1EE}\u{1F1F3}', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940', englishName: 'Hindi' },
      { code: 'th', flag: '\u{1F1F9}\u{1F1ED}', nativeName: '\u0e44\u0e17\u0e22', englishName: 'Thai' },
      { code: 'vi', flag: '\u{1F1FB}\u{1F1F3}', nativeName: 'Ti\u1ebfng Vi\u1ec7t', englishName: 'Vietnamese' },
      { code: 'id', flag: '\u{1F1EE}\u{1F1E9}', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
      { code: 'ms', flag: '\u{1F1F2}\u{1F1FE}', nativeName: 'Bahasa Melayu', englishName: 'Malay' },
      { code: 'tl', flag: '\u{1F1F5}\u{1F1ED}', nativeName: 'Filipino', englishName: 'Filipino' },
    ],
  },
];

/** Flat lookup for finding current language info quickly */
const ALL_LANGUAGES = LANGUAGE_GROUPS.flatMap((g) => g.languages);

function getDisplayCode(code: string): string {
  // Show short code uppercase, e.g. "EN", "DE", "FR-CA"
  return code.toUpperCase();
}

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = ALL_LANGUAGES.find((l) => l.code === language) ?? ALL_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
      >
        <span>{currentLang.flag}</span>
        <span>{getDisplayCode(currentLang.code)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 max-h-96 overflow-y-auto bg-surface border border-border rounded-xl shadow-lg z-50">
          {LANGUAGE_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider bg-surface-secondary sticky top-0">
                {group.label}
              </div>
              {group.languages.map((lang) => {
                const isActive = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                      isActive
                        ? 'bg-accent-subtle text-accent-text'
                        : 'text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1">
                      <span className="font-medium">{lang.nativeName}</span>
                      {lang.nativeName !== lang.englishName && (
                        <span className="text-text-tertiary ml-1">({lang.englishName})</span>
                      )}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
