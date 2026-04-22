import { api } from "./api";

export const programService = {
    getProgramsByProfile: (profileId) => 
        api.get(`/programs/profile/${profileId}`),
    
    getByProfileAndDate: (profileId, date) =>
        api.get(`/programs/profile/${profileId}`, {
            params: { date },
        }),

    createProgram: (programData) => 
        api.post("/programs", programData),
    
    deleteProgram: (id) => 
        api.delete(`/programs/${id}`)
}
