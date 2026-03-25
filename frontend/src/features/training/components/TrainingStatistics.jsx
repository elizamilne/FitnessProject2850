import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const lineData = [
  { day: "Mon", value: 2 },
  { day: "Tue", value: 4 },
  { day: "Wed", value: 3 },
  { day: "Thu", value: 5 },
  { day: "Fri", value: 6 },
];

const barData = [
  { name: "Push", reps: 30 },
  { name: "Pull", reps: 45 },
  { name: "Legs", reps: 50 },
];

const TrainingStatistics = () => {
  return (
    <div className="gap-4 w-[100%] lg:w-[90%] mx-auto">
      <h2 className="text-xl font-semibold mb-3">Statistics</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Graph 1 */}
        <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <h4 className="mb-2 text-sm font-medium text-gray-600 text-left">
            Weekly Workouts
          </h4>

          <div className="h-[250px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2 */}
        <div className="hidden sm:block flex-1 min-w-0 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <h4 className="mb-2 text-sm font-medium text-gray-600 text-left">
            Reps by Muscle Group
          </h4>

          <div className="h-[250px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="reps" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingStatistics;