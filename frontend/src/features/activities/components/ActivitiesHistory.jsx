import { useEffect, useState } from "react";
import { activityService } from "../../../services/activity";

const ActivitiesHistory = ({ profileId }) => {
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const PAGE_SIZE = 8;

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!profileId) return;

        const params = {
          search: search || undefined,
          date: date || undefined,
          sort,
          page,
          limit: PAGE_SIZE,
        };

        const res = await activityService.getActivitiesById(profileId, params);

        const activitiesData = res.data.data;
        const total = res.data.totalElements;

        setActivities(activitiesData);
        setHasNext(page * PAGE_SIZE < total);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      }
    };

    fetchActivities();
  }, [search, date, sort, page, profileId]);

  const isEmpty = activities.length === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Activities</h1>
        <p className="text-sm text-gray-500">
          Track and manage your activities
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            🔍
          </div>

          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>

        <div className="flex items-center gap-2 md:ml-auto flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm bg-white/60 backdrop-blur-md border border-white/50 text-gray-700 focus:outline-none"
          />

          <button
            onClick={() => setSort((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/60 backdrop-blur-md border border-white/50 text-gray-700 hover:text-gray-900 transition"
          >
            {sort === "asc" ? "Oldest" : "Newest"}
          </button>
        </div>
      </div>

      {/* Table / Empty (STABILIZED) */}
      <div className="min-h-[320px] overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/50">
        {isEmpty ? (
          <div className="min-h-[320px] flex items-center justify-center px-6">
            <div className="text-center text-gray-400 max-w-sm space-y-2">
              <p className="text-base font-semibold text-gray-500">
                No activities found
              </p>
              <p className="text-sm leading-relaxed">
                Start training to see your activity history here
              </p>
            </div>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Activity</th>
                <th className="px-5 py-3 text-left">Metrics</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200/60">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-white/50 transition">
                  <td className="px-5 py-4 text-gray-600">
                    {activity.date}
                  </td>

                  <td className="px-5 py-4 text-gray-900 font-medium">
                    {activity.exerciseName ||
                      `Exercise ${activity.exerciseId}`}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {activity.metrics?.length
                      ? activity.metrics
                        .map((m) => `${m.value ?? "-"} ${m.unit ?? ""}`)
                        .join(" · ")
                      : "No metrics"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isEmpty && (
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600 font-medium">
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasNext}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesHistory;