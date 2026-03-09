import { Skeleton } from "@/components/ui/skeleton";

const SCHEDULED_ITEMS = ["s1", "s2", "s3"];
const STAT_ITEMS_1 = ["st1-1", "st1-2", "st1-3"];
const STAT_ITEMS_2 = ["st2-1", "st2-2", "st2-3"];
const OMIKUJI_ITEMS = ["o1", "o2", "o3", "o4", "o5"];
const COINFLIP_ITEMS = ["c1", "c2", "c3"];
const JANKEN_ITEMS = ["j1", "j2", "j3"];

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Profile Header Block */}
      <div className="mb-6 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
        {/* Banner */}
        <Skeleton className="h-32 md:h-48 w-full rounded-none" />
        <div className="px-6 md:px-8 pb-6 relative">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 border-[6px] border-white dark:border-[#2B2D31] rounded-full absolute -mt-12 md:-mt-16" />

          <div className="pt-[52px] md:pt-[72px] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <Skeleton className="h-8 md:h-9 w-48 mb-2" />
              <Skeleton className="h-6 w-32 rounded-full mt-1" />
            </div>
            <Skeleton className="h-10 w-40 rounded-[4px] self-start" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Scheduled Messages */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-0">
            {SCHEDULED_ITEMS.map((id) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 shrink-0 ml-14 sm:ml-0">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Info */}
        <div className="col-span-1 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 flex flex-col gap-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-9 w-40" />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5">
                {STAT_ITEMS_1.map((id) => (
                  <div key={id}>
                    <Skeleton className="h-3 w-16 mb-2" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl border border-gray-100 dark:border-white/5">
                {STAT_ITEMS_2.map((id) => (
                  <div key={id}>
                    <Skeleton className="h-3 w-16 mb-2" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
              <Skeleton className="h-3 w-48" />
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Omikuji History */}
        <div className="col-span-1 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="p-0">
            {OMIKUJI_ITEMS.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5"
              >
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Coin Flip History */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-0">
            {COINFLIP_ITEMS.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 gap-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Janken History */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-6 py-4 border-b border-gray-200 dark:border-black/20 shrink-0">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-0">
            {JANKEN_ITEMS.map((id) => (
              <div
                key={id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 gap-x-4 gap-y-2"
              >
                <div className="flex items-center gap-3 w-full sm:w-[220px] shrink-0">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>

                <div className="flex-1 flex items-center justify-center sm:justify-start gap-4 min-w-[120px]">
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-3 w-4" />
                  <Skeleton className="h-6 w-8" />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                  <div className="w-24 flex flex-col items-start sm:items-end gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
