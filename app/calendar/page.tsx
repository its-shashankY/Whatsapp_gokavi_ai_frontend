import { DashboardShell } from "@/components/layout/DashboardShell";
import { WeekGrid } from "@/components/calendar/WeekGrid";
import { Icon } from "@/components/ui/Icon";
import { calendarWeek } from "@/lib/mockData";

export default function CalendarPage() {
  return (
    <DashboardShell title="Gokavi Admin" searchPlaceholder="Search appointments...">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Dr. Sharma&apos;s Calendar
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">October 23 – 29, 2023</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-outline-variant rounded-full font-button text-button text-on-surface hover:bg-surface-container-low transition-colors">
            Today
          </button>
          <div className="flex items-center bg-surface-container-low rounded-full">
            <button className="p-2 rounded-l-full hover:bg-surface-container-high transition-colors">
              <Icon name="chevron_left" />
            </button>
            <button className="p-2 rounded-r-full hover:bg-surface-container-high transition-colors">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>

      <WeekGrid week={calendarWeek} />
    </DashboardShell>
  );
}
