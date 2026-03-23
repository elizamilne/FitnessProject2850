package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.statements.InsertStatement

import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.time.format.TextStyle
import java.util.Locale

import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramDTO
import org.fitnessapp.models.ProgramSchedule
import org.fitnessapp.models.CreateProgramRequest

import org.fitnessapp.models.Profile
import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseMetric


private fun ResultRow.toProgramDTO(days: List<String>) = ProgramDTO(
    id = this[Program.id],
    profileId = this[Program.profileId],
    title = this[Program.title],
    bannerUrl = this[Program.bannerUrl],
    weeklyFrequency = days
)

private fun createProgram(
    builder: InsertStatement<*>,
    request: CreateProgramRequest
) {
    builder[Program.title] = request.title
    builder[Program.bannerUrl] = request.bannerUrl
    builder[Program.profileId] = request.profileId
}

private fun findProgramsByProfileId(profileId: Long): List<ProgramDTO> = transaction {
    Program.selectAll()
        .where { Program.profileId eq profileId }
        .map { row ->
            val programId = row[Program.id]

            val days = ProgramSchedule.selectAll()
                .where { ProgramSchedule.programId eq programId }
                .map { it[ProgramSchedule.day] }

            row.toProgramDTO(days)
        }
}

private fun findProgramsByProfileIdAndDay(
    profileId: Long, 
    day: String
): List<ProgramDTO> = transaction {

    Program.selectAll()
        .where { Program.profileId eq profileId }
        .mapNotNull { row ->
            val programId = row[Program.id]

            val days = ProgramSchedule.selectAll()
                .where { ProgramSchedule.programId eq programId }
                .map { it[ProgramSchedule.day] }

            if (day in days) {
                row.toProgramDTO(days)
            } else {
                null
            }
        }
}

private fun getDayOfWeek(dateParam: String?): String? {
    return dateParam?.let {
        val date = LocalDate.parse(it) 
        date.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
    }
}

fun findProgramById(programId: Long): ResultRow? = transaction {
    Program
        .selectAll().where { Program.id eq programId }
        .singleOrNull()
}

fun Route.programRoutes() { 
    route("/programs") {
        get("/profile/{profileId}") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()

            if (profileId == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid Profile ID")
                return@get
            }

            val dateParam = call.request.queryParameters["date"]

            val dayOfWeek = try {
                getDayOfWeek(dateParam)
            } catch (e: DateTimeParseException) {
                call.respond(HttpStatusCode.BadRequest, "Invalid date format. Use YYYY-MM-DD")
                return@get
            }

            val programs = if (dayOfWeek != null) {
                findProgramsByProfileIdAndDay(profileId, dayOfWeek)
            } else {
                findProgramsByProfileId(profileId)
            }

            call.respond(HttpStatusCode.OK, programs)
        }

        post {
            val request = call.receive<CreateProgramRequest>()

            val existingProfile = transaction {
                Profile.selectAll()
                    .where { Profile.id eq request.profileId }
                    .singleOrNull()
            }

            if (existingProfile == null) {
                call.respond(HttpStatusCode.BadRequest, "Profile not found")
                return@post
            }

            val programId = transaction { 
                 Program.insert { builder ->
                    createProgram(builder, request)
                } get Program.id
            }

            call.respond(
                HttpStatusCode.Created,
                mapOf("id" to programId)
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()

            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "Invalid ID")
                return@delete
            }

            val existingProgram = transaction {
                Program.selectAll()
                    .where { Program.id eq id }
                    .singleOrNull()
            }

            if (existingProgram == null) {
                call.respond(HttpStatusCode.NotFound, "Program not found")
                return@delete
            }

            transaction {
                val programExerciseIds = ProgramExercise.selectAll()
                    .where { ProgramExercise.programId eq id }
                    .map { it[ProgramExercise.id] }
                
                if (programExerciseIds.isNotEmpty()) {
                    ProgramExerciseMetric.deleteWhere { programExerciseId inList programExerciseIds }
                }

                ProgramExercise.deleteWhere { ProgramExercise.programId eq id }
                ProgramSchedule.deleteWhere { ProgramSchedule.programId eq id }
                Program.deleteWhere { Program.id eq id }
            }

            call.respond(HttpStatusCode.OK, "Program deleted")
        }
    }
}