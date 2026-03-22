package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.ProgramSchedule
import org.fitnessapp.models.ProgramScheduleDTO

import java.time.LocalDate

private fun ResultRow.toProgramScheduleDTO() = ProgramScheduleDTO(
    id = this[ProgramSchedule.id],
    day = this[ProgramSchedule.day],
    programId = this[ProgramSchedule.programId]
)

private fun findSchedulesByProgramId(programId: Long) = transaction {
    ProgramSchedule.selectAll()
        .where { ProgramSchedule.programId eq programId }
        .map { it.toProgramScheduleDTO() }
}

fun Route.programScheduleRoutes() {
    route("/program-schedules") {

        get("/{programId}") {
            val programId = call.parameters["programId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid Program ID")

            val schedules = findSchedulesByProgramId(programId)

            if (schedules.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "No schedules found")
            } else {
                call.respond(HttpStatusCode.OK, schedules)
            }
        }

        post {
            val request = call.receive<ProgramScheduleDTO>()

            val newId = transaction {
                ProgramSchedule.insert {
                    it[programId] = request.programId
                    it[day] = request.day
                } get ProgramSchedule.id
            }

            call.respond(HttpStatusCode.Created, request.copy(id = newId))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val deleted = transaction {
                ProgramSchedule.deleteWhere { ProgramSchedule.id eq id }
            }

            if (deleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Schedule not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}