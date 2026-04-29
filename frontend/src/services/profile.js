import { api } from "./api";

export const profileService = {
    getUserProfile: (userId) =>
        api.get(`/profiles/user/${userId}`),
    
    createProfile: (profileData) => 
        api.post("/profiles", profileData),

    searchProfiles: (query, profileId) =>
        api.get(`/profiles/search?query=${query}&profileId=${profileId}`)
}
