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

const TrainingStatistics = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  // Detect screen size safely
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const profileId = 1;
        const { data } = await activityService.getActivitiesById(profileId);
        const activities = data.data;

        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        // Get current week range
        const now = new Date();
        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const weeklyActivities = activities.filter((item) => {
          const date = new Date(item.date);
          return date >= startOfWeek && date <= endOfWeek;
        });

        // Bar chart (weekly)
        const perDay = weeklyActivities.reduce((acc, item) => {
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

        // Line chart (trend)
        const perDate = activities.reduce((acc, item) => {
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
      } catch (error) {
        console.error("Failed to load statistics:", error);
      }
    };

    loadStats();
  }, []);

  const hasEnoughData = barData.some((d) => d.value > 0) && lineData.length > 1;

  return (
    <div className="w-full lg:w-[100%] mx-auto space-y-6">
      {!hasEnoughData ? (
        <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="w-full flex items-center justify-center py-12">
            <div className="text-center text-gray-400 max-w-sm space-y-2">
              <p className="text-base font-semibold text-gray-500">
                Not enough data yet
              </p>
              <p className="text-sm leading-relaxed">
                Complete a few workouts to unlock your statistics
              </p>
            </div>
          </div>

          {/* EXACT same gradient as Overview */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none 
                bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
          />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Weekly Bar */}
          <div
            className="relative flex-1 min-w-0 p-5 rounded-3xl
                        bg-white/70 backdrop-blur-xl border border-white/50
                        shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
          >
            <h4 className="mb-3 text-sm font-medium text-gray-600">
              Weekly Workouts
            </h4>

            <div className="h-[260px] sm:h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "rgba(99,102,241,0.08)" }}
                    contentStyle={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    fill="url(#barGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="absolute inset-0 rounded-3xl pointer-events-none 
                          bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
            />
          </div>

          {/* Line Chart */}
          {isDesktop && (
            <div
              className="relative flex-1 min-w-0 p-5 rounded-3xl
                          bg-white/70 backdrop-blur-xl border border-white/50
                          shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
            >
              <h4 className="mb-3 text-sm font-medium text-gray-600">
                Workout Trend
              </h4>

              <div className="h-[260px] sm:h-[340px] w-full">
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
                      tick={{ fontSize: 12, fill: "#6b7280" }}
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
                      contentStyle={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="url(#lineGradient)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div
                className="absolute inset-0 rounded-3xl pointer-events-none 
                            bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingStatistics;
