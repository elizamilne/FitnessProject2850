import { api } from "./api";

export const muscleGroupService = {
    getAll: () => 
        api.get("/muscle-groups"),

    getById: (id) => 
        api.get(`/muscle-groups/${id}`),
}