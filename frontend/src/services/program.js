import { api } from "./api";

export const programService = {
    getProgramsByProfile: (profileId) => 
        api.get(`/programs/profile/${profileId}`),
    
    createProgram: (programData) => 
        api.post("/programs", programData),
    
    deleteProgram: (id) => 
        api.delete(`/programs/${id}`)
}
