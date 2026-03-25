const ActivitiesHistory = () => {
  return (
    <div class="bg-white p-6 rounded-2xl shadow space-y-6">
      <div>
        <h1 class="text-2xl font-semibold">Activities</h1>
        <p class="text-sm text-gray-500">Track and manage your activities</p>
      </div>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="w-full md:max-w-sm relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search activities..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div class="flex flex-wrap gap-2">
          <button class="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Date
          </button>
          <button class="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Activity
          </button>
          <button class="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Distance
          </button>
          <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Activity</th>
              <th class="px-4 py-3">Distance</th>
              <th class="px-4 py-3">Duration</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-25</td>
              <td class="px-4 py-3">Running</td>
              <td class="px-4 py-3">5 km</td>
              <td class="px-4 py-3">25 min</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-24</td>
              <td class="px-4 py-3">Cycling</td>
              <td class="px-4 py-3">20 km</td>
              <td class="px-4 py-3">1 hr</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-25</td>
              <td class="px-4 py-3">Running</td>
              <td class="px-4 py-3">5 km</td>
              <td class="px-4 py-3">25 min</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-24</td>
              <td class="px-4 py-3">Cycling</td>
              <td class="px-4 py-3">20 km</td>
              <td class="px-4 py-3">1 hr</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-25</td>
              <td class="px-4 py-3">Running</td>
              <td class="px-4 py-3">5 km</td>
              <td class="px-4 py-3">25 min</td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">2026-03-24</td>
              <td class="px-4 py-3">Cycling</td>
              <td class="px-4 py-3">20 km</td>
              <td class="px-4 py-3">1 hr</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivitiesHistory;
