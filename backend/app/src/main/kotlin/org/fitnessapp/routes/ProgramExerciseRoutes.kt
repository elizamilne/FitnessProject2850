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

import java.math.BigDecimal

private fun ResultRow.toProgramExerciseDTO() = ProgramExerciseDTO(
    id = this[ProgramExercise.id],
    programId = this[ProgramExercise.programId],
    exerciseId = this[ProgramExercise.exerciseId]
)

private fun ResultRow.toProgramExerciseWithMetrics(): Map<String, Any?> {
    val peId = this[ProgramExercise.id]

    val metrics = getMetricsForProgramExercise(peId)

    return mapOf(
        "programExerciseId" to peId,
        "exerciseName" to this[Exercise.name],
        "image" to this[Exercise.image],
        "metrics" to metrics
    )
}

private fun createProgramExercise(
    builder: InsertStatement<*>,
    request: CreateProgramExerciseRequest
) {
    builder[ProgramExercise.programId] = request.programId
    builder[ProgramExercise.exerciseId] = request.exerciseId
}

private fun createProgramExerciseMetric(
    builder: InsertStatement<*>,
    programExerciseId: Long,
    metric: ProgramExerciseMetricRequest
) {
    builder[ProgramExerciseMetric.programExerciseId] = programExerciseId
    builder[ProgramExerciseMetric.metricTypeId] = metric.metricTypeId
    builder[ProgramExerciseMetric.value] = BigDecimal.valueOf(metric.value)
}

private fun getMetricsForProgramExercise(programExerciseId: Long): List<Map<String, Any>> =
    (ProgramExerciseMetric innerJoin MetricType)
        .selectAll().where { ProgramExerciseMetric.programExerciseId eq programExerciseId }
        .map { mRow ->
            mapOf(
                "metricName" to mRow[MetricType.name],
                "value" to mRow[ProgramExerciseMetric.value].toDouble()
            )
        }

private fun findAllProgramExercises(): List<ProgramExerciseDTO> = transaction {
    ProgramExercise
        .selectAll()
        .map { it.toProgramExerciseDTO() }
}

private fun createProgramExerciseAndReturnId(
    request: CreateProgramExerciseRequest
): Long =
    ProgramExercise.insert { builder ->
        createProgramExercise(builder, request)
    } get ProgramExercise.id


private fun insertMetricIfTypeExists(
    programExerciseId: Long,
    metric: ProgramExerciseMetricRequest
) {
    if (metricTypeExists(metric.metricTypeId)) {
        ProgramExerciseMetric.insert { builder ->
            createProgramExerciseMetric(builder, programExerciseId, metric)
        }
    }
}

private fun insertMetricsForProgramExercise(
    programExerciseId: Long,
    metrics: List<ProgramExerciseMetricRequest>
) {
    metrics.forEach { metric ->
        insertMetricIfTypeExists(programExerciseId, metric)
    }
}

private fun deleteProgramExerciseAndMetrics(programExerciseId: Long): Int = transaction {
    ProgramExerciseMetric.deleteWhere {
        ProgramExerciseMetric.programExerciseId eq programExerciseId
    }

    ProgramExercise.deleteWhere {
        ProgramExercise.id eq programExerciseId
    }
}

fun Route.programExerciseRoutes() { 
    route("/program-exercises") {
        get {
            val programExercises = findAllProgramExercises()

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
                val currentProgramExerciseId = createProgramExerciseAndReturnId(request)
                insertMetricsForProgramExercise(currentProgramExerciseId, request.metrics)
                currentProgramExerciseId
            }

            call.respond(HttpStatusCode.Created, mapOf("id" to programExerciseId))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val deleted = deleteProgramExerciseAndMetrics(id)
        
            if (deleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}