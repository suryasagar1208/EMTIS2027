import type { RegistrationFeeTier } from '@/types/conference';

interface RegistrationTableProps {
  tiers: RegistrationFeeTier[];
}

export function RegistrationTable({ tiers }: RegistrationTableProps) {
  return (
    <div>
      {/* Desktop & Tablet Table */}
      <div className="theme-surface hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/20 bg-surface-muted/75">
              <th
                scope="col"
                className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-ink"
              >
                Participant Category
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-accent"
              >
                Early Registration (INR)
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-ink"
              >
                Regular Registration (INR)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/15">
            {tiers.map((tier) => (
              <tr
                key={tier.id}
                className="transition-colors hover:bg-surface-muted/45"
              >
                <td className="px-6 py-4 text-sm font-semibold text-ink sm:text-base">
                  {tier.category}
                </td>
                <td className="px-6 py-4 text-right font-mono text-base font-bold tabular-nums text-accent">
                  {tier.earlyInr}
                </td>
                <td className="px-6 py-4 text-right font-mono text-base font-semibold tabular-nums text-ink">
                  {tier.regularInr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Adapted Fee Cards (zero horizontal scrolling) */}
      <div className="space-y-3 md:hidden" aria-label="Registration fee categories">
        {tiers.map((tier) => (
          <div key={tier.id} className="theme-surface p-4">
            <h3 className="font-serif text-base font-semibold text-ink">
              {tier.category}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-border/15 pt-3">
              <div className="theme-surface-muted p-2.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Early Bird
                </span>
                <span className="mt-0.5 block font-mono text-base font-bold tabular-nums text-accent">
                  {tier.earlyInr}
                </span>
              </div>
              <div className="theme-surface-muted p-2.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Regular
                </span>
                <span className="mt-0.5 block font-mono text-base font-bold tabular-nums text-ink">
                  {tier.regularInr}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

