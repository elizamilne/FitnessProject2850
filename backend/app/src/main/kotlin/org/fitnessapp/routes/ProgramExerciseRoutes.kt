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

import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseDTO
import org.fitnessapp.models.CreateProgramExerciseRequest

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricRequest
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.Program 

import org.fitnessapp.services.ExerciseService
import org.fitnessapp.services.MetricTypeService

import java.math.BigDecimal

import org.fitnessapp.services.ProgramExerciseService
import org.fitnessapp.services.toProgramExerciseWithMetrics
import org.fitnessapp.services.toProgramExerciseDTO

fun Route.programExerciseRoutes() { 
    route("/program-exercises") {
        get {
            val programExercises = ProgramExerciseService.findAllProgramExercises()

            call.respond(HttpStatusCode.OK, programExercises)
        }

        get("/program/{programId}") {
            val programId = call.parameters["programId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid Program Id")
            
            val results = transaction {
                (ProgramExercise innerJoin Exercise)
                    .selectAll().where { ProgramExercise.programId eq programId }
                    .map { it.toProgramExerciseWithMetrics() }
            }

            call.respond(HttpStatusCode.OK, results)
        }

        post {
            val request = call.receive<CreateProgramExerciseRequest>()

            val program = findProgramById(request.programId)
            if (program == null) {
                return@post call.respond(HttpStatusCode.BadRequest, "Program not found")
            }

            val exercise = ExerciseService.findExerciseById(request.exerciseId)
            if (exercise == null) {
                return@post call.respond(HttpStatusCode.BadRequest, "Exercise not found")
            }

            val programExerciseId = transaction {
                val currentProgramExerciseId = ProgramExerciseService.createProgramExerciseAndReturnId(request)
                ProgramExerciseService.insertMetricsForProgramExercise(currentProgramExerciseId, request.metrics)
                currentProgramExerciseId
            }

            call.respond(HttpStatusCode.Created, mapOf("id" to programExerciseId))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val deleted = ProgramExerciseService.deleteProgramExerciseAndMetrics(id)
        
            if (deleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}