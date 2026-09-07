import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { DayColumn } from "@/types";

export function WeekGrid({ week, todayDate }: { week: DayColumn[]; todayDate: number | null }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(7,2,53,0.04)] border border-surface-container-highest p-4 md:p-6">
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-surface-container-highest" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">AVAILABLE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">BOOKED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error-container border border-error/20" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">BLOCKED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:min-w-[900px] overflow-x-auto pb-4">
        {week.map((column) => {
          if (column.closed) {
            return (
              <div
                key={column.day}
                className="flex flex-col gap-3 min-w-[140px] opacity-50 bg-surface-container-low rounded-lg p-2"
              >
                <div className="text-center pb-2">
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant">{column.day}</h3>
                  <p className="font-headline-md text-headline-md text-on-surface-variant">{column.date}</p>
                </div>
                <div className="flex-1 flex items-center justify-center py-10">
                  <span className="font-label-caps text-label-caps text-outline text-center">CLOSED</span>
                </div>
              </div>
            );
          }

          const isToday = todayDate !== null && column.date === todayDate;

          return (
            <div key={column.day} className="flex flex-col gap-3 min-w-[140px]">
              <div
                className={cn(
                  "text-center pb-2",
                  isToday ? "border-b-2 border-primary" : "border-b border-surface-container-highest",
                )}
              >
                <h3
                  className={cn(
                    "font-label-caps text-label-caps",
                    isToday ? "text-primary" : "text-on-surface-variant",
                  )}
                >
                  {column.day}
                </h3>
                <p className="font-headline-md text-headline-md text-on-surface">{column.date}</p>
              </div>
              {column.slots.map((appointment) => {
                if (appointment.status === "booked") {
                  return (
                    <div
                      key={appointment.id}
                      className="bg-primary text-on-primary p-3 rounded-lg shadow-sm border border-primary/20 flex flex-col justify-between min-h-[80px]"
                    >
                      <span className="font-label-caps text-label-caps opacity-90">{appointment.time}</span>
                      <span className="font-button text-button text-sm truncate">
                        {appointment.patientName}
                      </span>
                    </div>
                  );
                }
                if (appointment.status === "blocked") {
                  return (
                    <div
                      key={appointment.id}
                      className="bg-error-container text-on-error-container p-3 rounded-lg min-h-[80px] border border-error/10 flex flex-col justify-center items-center opacity-70"
                    >
                      <span className="font-label-caps text-label-caps">{appointment.time}</span>
                      <Icon name="block" className="!text-sm mt-1" />
                    </div>
                  );
                }
                return (
                  <div
                    key={appointment.id}
                    className="bg-surface-container-lowest border border-surface-container-highest p-3 rounded-lg min-h-[80px] hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-center group"
                  >
                    <span className="font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">
                      {appointment.time}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
