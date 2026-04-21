import { api } from "./api";

export const activityService = {
    getActivityById: (id) => 
        api.get(`/activities/${id}`),

    getBestActivity: (id) =>
        api.get(`/activities/${id}/best`),

    createActivity: (activityData) =>
        api.post("/activities", activityData),

    deleteActivity: (id) =>
        api.delete(`/activities/${id}`),
};