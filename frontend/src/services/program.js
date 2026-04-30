import { api } from "./api";

export const programService = {
    getProgramsByProfile: (profileId) => 
        api.get(`/programs/profile/${profileId}`),
    
    getByProfileAndDate: (profileId, date) =>
        api.get(`/programs/profile/${profileId}`, {
            params: { date },
        }),

    getActive: (profileId) =>
        api.get(`/programs/profile/${profileId}/active`),

    getArchived: (profileId) =>
        api.get(`/programs/profile/${profileId}/archived`),

    toggleArchive: (id) =>
        api.post(`/programs/${id}/archive`),
     
    createProgram: (programData) => 
        api.post("/programs", programData),
    
    deleteProgram: (id) => 
        api.delete(`/programs/${id}`)
}
