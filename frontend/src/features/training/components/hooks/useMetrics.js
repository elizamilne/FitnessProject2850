import { useEffect, useState } from "react";
import { metricService } from "../../../../services/metricType";

export const useMetrics = () => {
  const [metricMap, setMetricMap] = useState({});

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const { data } = await metricService.getAll();

        const map = Object.fromEntries(
          data.map((m) => [
            m.id,
            {
              name: m.name,
              unit: m.unit,
            },
          ])
        );

        setMetricMap(map);
      } catch (error) {
        console.error("Failed to load metrics", error);
      }
    };

    loadMetrics();
  }, []);

  return { metricMap };
};