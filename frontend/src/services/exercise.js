import { api } from "./api";

export const exerciseService = {
    getAll: () => 
        api.get("/exercises"),

    getById: (id) => 
        api.get(`/exercises/${id}`),

    getMetrics: (id) =>
        api.get(`/exercises/${id}/metrics`),
}
