import { api } from "./api";

export const categoryService = {
    getAll: () => 
        api.get("/categories"),

    getById: (id) => 
        api.get(`/categories/${id}`)
}