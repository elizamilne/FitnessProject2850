import { api } from "./api";

export const activityService = {
    getActivitiesById: (id, params = {}) => 
        api.get(`/activities/${id}`, { params }),

    getCompleted: (profileId, date) =>
        api.get(`/activities/${profileId}/completed`, {
            params: { date },
        }),

    getBestActivity: (id) =>
        api.get(`/activities/${id}/best`),

    createActivity: (activityData) =>
        api.post("/activities", activityData),

    deleteActivity: (id) =>
        api.delete(`/activities/${id}`),

    deleteByProgramExercise: (profileId, programExerciseId, date) =>
        api.delete("/activities/by-program-exercise", {
            params: { profileId, programExerciseId, date },
        }),
};