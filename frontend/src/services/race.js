import { api } from "./api";

export const raceService = {
    getAll: () => 
        api.get("/races"),

    getById: (id) => 
        api.get(`/races/${id}`),

    getNextRace: (profileId) => 
        api.get(`/races/next-race/${profileId}`),

    getCompleted: (profileId) =>
        api.get(`/races/profile/${profileId}/completed`),

    getUpcoming: (profileId) =>
        api.get(`/races/profile/${profileId}/upcoming`),

    toggleComplete: (id) =>
        api.post(`/races/${id}/complete`),

    createRace: (data) => 
        api.post("/races", data),

    updateRace: (id, data) => 
        api.put(`/races/${id}`, data),

    deleteRace: (id) =>
        api.delete(`/races/${id}`)
};

