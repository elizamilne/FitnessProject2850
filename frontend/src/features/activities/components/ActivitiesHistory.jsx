import { useEffect, useState } from "react";
import { activityService } from "../../../services/activity";

const ActivitiesHistory = () => {
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
        const profileId = 1;

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
  }, [search, date, sort, page]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Activities</h1>
        <p className="text-sm text-gray-500">
          Track and manage your activities
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 md:ml-auto flex-wrap">
          <button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
            />
          </button>

          <button
            onClick={() => setSort((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap"
          >
            Sort: {sort.toUpperCase()}
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Metrics</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{activity.date}</td>
                  <td className="px-4 py-3">
                    {activity.exerciseName || `Exercise ${activity.exerciseId}`}
                  </td>
                  <td className="px-4 py-3">
                    {activity.metrics?.length
                      ? activity.metrics
                          .map((m) => `${m.value ?? "-"} ${m.unit ?? ""}`)
                          .join(" · ")
                      : "No metrics"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasNext}
          className="px-3 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivitiesHistory;
