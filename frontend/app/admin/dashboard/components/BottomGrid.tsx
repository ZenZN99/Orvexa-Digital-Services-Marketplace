"use client";
import { Activity, CheckCircle2, Clock3 } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import AnimatedNumber from "./AnimatedNumber";
import Skeleton from "./Skeleton";
import { CSSProperties } from "react";
import { timeAgo } from "../utils/helpers";

interface PendingAction {
  label: string;
  value: number;
  suffix?: string;
  ready: boolean;
  icon: React.ElementType;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: number;
  icon: React.ElementType;
}

interface BottomGridProps {
  pendingActions: PendingAction[];
  allCaughtUp: boolean;
  activityReady: boolean;
  recentActivity: RecentActivity[];
  now: number;
}

export default function BottomGrid({
  pendingActions,
  allCaughtUp,
  activityReady,
  recentActivity,
  now,
}: BottomGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.4fr]">
      {/* Pending actions */}
      <DashboardPanel
        delay={420}
        title="Pending Actions"
        description="Items that may require administrator attention."
        icon={Clock3}
      >
        <div className="mt-5 divide-y divide-white/5">
          {pendingActions.map((action) => {
            const Icon = action.icon;
            const hasItems = action.value > 0;

            return (
              <div
                key={action.label}
                className="group flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
                      hasItems
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-white/4 text-white/40 group-hover:bg-brand-green/10 group-hover:text-brand-green"
                    }`}
                  >
                    <Icon size={15} />
                  </div>

                  <span className="truncate text-sm text-white/55 transition-colors duration-300 group-hover:text-white/80">
                    {action.label}
                  </span>
                </div>

                {action.ready ? (
                  <span
                    className={`ml-4 flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                      hasItems
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    <AnimatedNumber
                      value={action.value}
                      suffix={action.suffix}
                    />
                  </span>
                ) : (
                  <Skeleton className="ml-4 h-7 w-7 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {allCaughtUp && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-brand-green/15 bg-brand-green/6 px-3 py-2.5 text-xs text-brand-green">
            <CheckCircle2 size={14} />
            You&apos;re all caught up. Nothing needs attention right now.
          </div>
        )}
      </DashboardPanel>

      {/* Recent activity */}
      <DashboardPanel
        delay={480}
        title="Recent Activity"
        description="Latest activity across the platform."
        icon={Activity}
      >
        <div className="mt-5 divide-y divide-white/5">
          {!activityReady &&
            [0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}

          {activityReady && recentActivity.length === 0 && (
            <p className="py-6 text-center text-xs text-white/30">
              No activity yet. New events will show up here.
            </p>
          )}

          {activityReady &&
            recentActivity.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.id}
                  className="dash-slide group flex gap-3 py-4 first:pt-0 last:pb-0"
                  style={{ "--d": `${540 + index * 80}ms` } as CSSProperties}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-green/20">
                    <Icon size={15} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                      <p className="text-sm font-medium text-white/75 transition-colors duration-300 group-hover:text-white">
                        {activity.title}
                      </p>

                      <span className="shrink-0 text-[10px] text-white/25">
                        {timeAgo(activity.time, now)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-white/30">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardPanel>
    </div>
  );
}
