import { api } from "./api";

export const activityMetricService = {
    getByActivityId: (activityId) =>
        api.get(`/activity-metrics/${activityId}`),

    updateMetric: (id, data) => 
        api.put(`/activity-metrics/${id}`, data),
}
