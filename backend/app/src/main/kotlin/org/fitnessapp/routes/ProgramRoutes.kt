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

import org.fitnessapp.services.ProgramService
import org.fitnessapp.services.ProfileService

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
                ProgramService.getDayOfWeek(dateParam)
            } catch (e: DateTimeParseException) {
                call.respond(HttpStatusCode.BadRequest, "Invalid date format. Use YYYY-MM-DD")
                return@get
            }

            val programs = if (dayOfWeek != null) {
                ProgramService.getProgramsByProfileIdAndDay(profileId, dayOfWeek)
            } else {
                ProgramService.getProgramsByProfileId(profileId)
            }

            call.respond(HttpStatusCode.OK, programs)
        }

        post {
            val request = call.receive<CreateProgramRequest>()

            ProfileService.getProfileById(request.profileId)
            
            val existingProfile = ProfileService.findProfileRowById(request.profileId) 

            if (existingProfile == null) {
                call.respond(HttpStatusCode.BadRequest, "Profile not found")
                return@post
            }

            val programId = ProgramService.createProgramAndReturnId(request)

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

            val existingProgram = ProgramService.findProgramRowById(id)

            if (existingProgram == null) {
                call.respond(HttpStatusCode.NotFound, "Program not found")
                return@delete
            }

            ProgramService.deleteProgramDependencies(id)

            call.respond(HttpStatusCode.OK, "Program deleted")
        }
    }
}