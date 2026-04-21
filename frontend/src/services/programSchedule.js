import { api } from "./api";

export const programScheduleService = {
    getById: (id) =>
        api.get(`/program-schedules/${id}`),

    createSchedule: (data) =>
        api.post("/program-schedules", data),

    deleteSchedule: (id) =>
        api.delete(`/program-schedules/${id}`)
}
