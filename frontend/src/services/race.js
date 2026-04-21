import { api } from "./api";

export const raceService = {
    getAll: () => 
        api.get("/races"),

    getById: (id) => 
        api.get(`/races/${id}`),

    createRace: (data) => 
        api.post("/races", data),

    updateRace: (id, data) => 
        api.put(`/races/${id}`, data),

    deleteRace: (id) =>
        api.delete(`/races/${id}`)
};

