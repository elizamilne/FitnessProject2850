import { api } from "./api";

export const exerciseService = {
    getAll: (categoryId) =>
        api.get("/exercises", {
            params: { categoryId },
        }),

    getById: (id) =>
        api.get(`/exercises/${id}`),

    getMetrics: (id) =>
        api.get(`/exercises/${id}/metrics`),
}
