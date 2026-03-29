import { FileQuestion } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
        <FileQuestion className="w-7 h-7 text-text-tertiary" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary mt-1 max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
