import { api } from "./api";

export const userService = {
    register: (userData) =>
        api.post("user/register", userData),
    
    login: (credentials) =>
        api.post("/user/login", credentials),
};
