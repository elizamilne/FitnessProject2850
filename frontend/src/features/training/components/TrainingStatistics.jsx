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
import { useEffect, useState } from "react";
import { activityService } from "../../../services/activity";

// const lineData = [
//   { day: "Mon", value: 2 },
//   { day: "Tue", value: 4 },
//   { day: "Wed", value: 3 },
//   { day: "Thu", value: 5 },
//   { day: "Fri", value: 6 },
// ];

// const barData = [
//   { name: "Push", reps: 30 },
//   { name: "Pull", reps: 45 },
//   { name: "Legs", reps: 50 },
// ];

const TrainingStatistics = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  // Detect screen size safely
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    checkScreen(); // initial
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      const profileId = 1;
      const { data } = await activityService.getActivitiesById(profileId);

      // Workouts per week
      const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const perDay = data.reduce((acc, item) => {
        const day = new Date(item.date).toLocaleDateString("en-GB", {
          weekday: "short",
        });

        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const bar = daysOrder.map((day) => ({
        day,
        value: perDay[day] || 0,
      }));

      const perDate = data.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + 1;
        return acc;
      }, {});

      const line = Object.entries(perDate)
        .map(([date, value]) => ({
          date,
          value,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setBarData(bar);
      setLineData(line);
    };

    loadStats();
  }, []);

  return (
    <div className="gap-4 w-[100%] lg:w-[90%] mx-auto">
      <h2 className="text-xl font-semibold mb-3">Statistics</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Graph 1 */}
        <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <h4 className="mb-2 text-sm font-medium text-gray-600 text-left">
            Weekly Workouts
          </h4>

          <div className="h-[250px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2 (only render on desktop) */}
        {isDesktop && (
          <div className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h4 className="mb-2 text-sm font-medium text-gray-600 text-left">
              Workout Trend
            </h4>

            <div className="h-[250px] sm:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    }
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingStatistics;
