import { api } from "./api";

export const profileService = {
    getUserProfile: (userId) =>
        api.get(`/profiles/user/${userId}`),
    
    createProfile: (profileData) => 
        api.post("/profiles", profileData),
}
