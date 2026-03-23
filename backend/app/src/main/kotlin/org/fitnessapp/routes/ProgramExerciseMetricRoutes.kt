package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement

import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricDTO
import org.fitnessapp.models.CreateProgramExerciseMetricRequest
import org.fitnessapp.models.UpdateProgramExerciseMetricRequest

import java.math.BigDecimal

import org.fitnessapp.services.ProgramExerciseMetricService
import org.fitnessapp.services.toProgramExerciseMetricDTO

fun Route.programExerciseMetricRoutes() { 
    route("/program-exercise-metrics") {
        get {
            val programExerciseMetrics = ProgramExerciseMetricService.findAllProgramExerciseMetrics()

            call.respond(HttpStatusCode.OK, programExerciseMetrics)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val programExerciseMetric = ProgramExerciseMetricService.findProgramExerciseMetricById(id)

            if (programExerciseMetric == null){ 
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.OK, programExerciseMetric)
            }
        }

        post {
            val request = call.receive<CreateProgramExerciseMetricRequest>()

            val createdProgramExerciseMetricId = ProgramExerciseMetricService.createProgramExerciseMetricAndReturnId(request)

            call.respond(
                HttpStatusCode.Created,
                request.toProgramExerciseMetricDTO(createdProgramExerciseMetricId)
            )
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid id")
            
            val request = try {
                call.receive<UpdateProgramExerciseMetricRequest>()
            } catch (e: Exception) {
                return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid request body")
                )
            }

            val rowsUpdated = ProgramExerciseMetricService.updateProgramExerciseMetricById(id, request)

            if (rowsUpdated == 0) {
                call.respond(
                    HttpStatusCode.NotFound,
                    mapOf("error" to "Program Exercise Metric not found")
                )
            } else {
                call.respond(
                    HttpStatusCode.OK,
                    mapOf("message" to "ProgramExerciseMetric updated successfully")
                )
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = ProgramExerciseMetricService.deleteProgramExerciseMetricById(id)

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
