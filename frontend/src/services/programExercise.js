import { api } from "./api";

export const programExerciseService = {
    getByProgram: (programId) => 
        api.get(`/program-exercises/program/${programId}`),

    addExerciseToProgram: (data) => 
        api.post("/program-exercises", data),

    deleteProgramExercise: (id) =>
        api.delete(`/program-exercises/${id}`)
};
