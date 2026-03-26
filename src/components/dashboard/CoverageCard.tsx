interface Props {
  coveragePercent: number;
  covered: number;
  total: number;
}

export function CoverageCard({ coveragePercent, covered, total }: Props) {
  const rounded = Math.round(coveragePercent);
  const color = rounded >= 80 ? 'text-green-600' : rounded >= 50 ? 'text-yellow-600' : 'text-red-600';
  const barColor = rounded >= 80 ? 'bg-green-500' : rounded >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Coverage</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${color}`}>{rounded}%</span>
        <span className="text-sm text-gray-500">{covered} / {total} Requirements</span>
      </div>
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${rounded}%` }} />
      </div>
    </div>
  );
}
