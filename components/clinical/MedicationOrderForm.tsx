import { Icon } from "@/components/ui/Icon";

export function MedicationOrderForm() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Icon name="prescriptions" className="text-tertiary" filled />
          <h3 className="font-headline-md text-headline-md text-on-surface">Medication Order</h3>
        </div>
        <Icon name="lock_person" className="text-error" />
      </div>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block font-label-caps text-label-caps text-primary mb-2">
            DRUG NAME (GENERIC/BRAND)
          </label>
          <div className="relative">
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 pl-10 font-body-md text-body-md outline-none"
              placeholder="Start typing medication name..."
              type="text"
            />
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">DOSE</label>
            <input
              className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
              placeholder="e.g., 50"
              type="text"
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">UNIT</label>
            <select className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md">
              <option>mg</option>
              <option>mcg</option>
              <option>mL</option>
              <option>IU</option>
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">ROUTE</label>
            <select className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md">
              <option>Oral (PO)</option>
              <option>Subcutaneous (SC)</option>
              <option>Intramuscular (IM)</option>
              <option>Intravenous (IV)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">FREQUENCY</label>
            <select className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md">
              <option>Once Daily (QD)</option>
              <option>Twice Daily (BID)</option>
              <option>Every 8 Hours (TID)</option>
              <option>As Needed (PRN)</option>
            </select>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-primary mb-2">DURATION</label>
            <div className="flex items-center gap-2">
              <input
                className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-3 font-body-md text-body-md outline-none"
                placeholder="Days"
                type="number"
              />
              <span className="text-on-surface-variant font-body-md">days</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant/20 gap-3">
          <button
            className="px-6 py-2 rounded-lg border border-primary text-primary font-button text-button hover:bg-primary/5 transition-colors"
            type="button"
          >
            Clear
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-button text-button hover:opacity-90 shadow-sm flex items-center gap-2"
            type="button"
          >
            <Icon name="signature" className="!text-[20px]" />
            Sign &amp; Submit Order
          </button>
        </div>
      </form>
    </div>
  );
}
