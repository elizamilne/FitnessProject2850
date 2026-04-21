import { api } from "./api";

export const metricService = {
    getAll: () => 
        api.get("/metrics"),

    getById: (id) =>
        api.get(`/metrics/${id}`)
}