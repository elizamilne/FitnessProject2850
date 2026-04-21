import { api } from "./api";

export const programExerciseMetricService = {
    getByProgramExerciseId: (programExerciseId) =>
        api.get(`/program-exercise-metrics/${programExerciseId}`),

    updateMetric: (id, data) =>
        api.put(`/program-exercise-metrics/${id}`, data),
}
