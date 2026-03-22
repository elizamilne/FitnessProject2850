package org.fitnessapp.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

private fun ResultRow.toScheduleResponse() = ScheduleResponse(
    id = this[ProgramSchedule.id],
    day = this[ProgramSchedule.day],
    programId = this[ProgramSchedule.programId]
)

private fun findSchedulesByProgramId(programId: Long): List<ScheduleResponse> = transaction {
    ProgramSchedule.selectAll()
        .where { ProgramSchedule.programId eq programId }
        .map { it.toScheduleResponse() }
}

fun Route.programScheduleRoutes() {
    route("/program-schedule") {

        post("/batch") {
            val request = call.receive<CreateScheduleRequest>()

            val existingProgram = transaction {
                Program.selectAll()
                    .where { Program.id eq request.programId }
                    .singleOrNull()
            }

            if (existingProgram == null) {
                call.respond(HttpStatusCode.BadRequest, "Program not found")
                return@post
            }

            val scheduleIds = transaction {
                request.days.distinct().map { dayName ->
                    ProgramSchedule.insert {
                        it[day] = dayName
                        it[programId] = request.programId
                    } get ProgramSchedule.id
                }
            }

            call.respond(
                HttpStatusCode.Created,
                mapOf("message" to "Schedules created", "ids" to scheduleIds)
            )
        }

        get("/today/{profileId}") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()

            if (profileId == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid Profile ID")
                return@get
            }

            val todayName = LocalDate.now()
                .dayOfWeek
                .name
                .lowercase()
                .replaceFirstChar { it.uppercase() }

            val todayPlans = transaction {
                (Program innerJoin ProgramSchedule)
                    .selectAll()
                    .where {
                        (Program.profileId eq profileId) and
                        (ProgramSchedule.day eq todayName)
                    }
                    .map {
                        mapOf(
                            "programId" to it[Program.id],
                            "title" to it[Program.title],
                            "bannerUrl" to it[Program.bannerUrl],
                            "day" to it[ProgramSchedule.day]
                        )
                    }
            }

            call.respond(HttpStatusCode.OK, todayPlans)
        }

        get("/program/{id}") {
            val programId = call.parameters["id"]?.toLongOrNull()

            if (programId == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid Program ID")
                return@get
            }

            val schedules = findSchedulesByProgramId(programId)

            call.respond(HttpStatusCode.OK, schedules)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()

            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid ID")
                return@delete
            }

            val deleted = transaction {
                ProgramSchedule.deleteWhere { ProgramSchedule.id eq id }
            }

            if (deleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Schedule not found")
                return@delete
            }

            call.respond(HttpStatusCode.OK, "Deleted")
        }
    }
}