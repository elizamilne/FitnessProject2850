import { api } from "./api";

export const activityService = {
    getActivitiesById: (id, params = {}) => 
        api.get(`/activities/${id}`, { params }),

    getBestActivity: (id) =>
        api.get(`/activities/${id}/best`),

    createActivity: (activityData) =>
        api.post("/activities", activityData),

    deleteActivity: (id) =>
        api.delete(`/activities/${id}`),
};