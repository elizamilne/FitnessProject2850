package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.statements.InsertStatement

import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricDTO
import org.fitnessapp.models.CreateProgramExerciseMetricRequest
import org.fitnessapp.models.UpdateProgramExerciseMetricRequest

import java.math.BigDecimal

private fun ResultRow.toProgramExerciseMetricDTO() = ProgramExerciseMetricDTO(
    id = this[ProgramExerciseMetric.id],
    metricTypeId = this[ProgramExerciseMetric.metricTypeId],
    programExerciseId = this[ProgramExerciseMetric.programExerciseId],
    value = this[ProgramExerciseMetric.value].toDouble()
)

private fun CreateProgramExerciseMetricRequest.toProgramExerciseMetricDTO(
    id: Long
) = ProgramExerciseMetricDTO(
    id = id,
    metricTypeId = metricTypeId,
    programExerciseId = programExerciseId,
    value = value
)

private fun createProgramExerciseMetric(
    builder: InsertStatement<*>,
    request: CreateProgramExerciseMetricRequest
) {
    builder[ProgramExerciseMetric.metricTypeId] = request.metricTypeId
    builder[ProgramExerciseMetric.programExerciseId] = request.programExerciseId
    builder[ProgramExerciseMetric.value] = request.value.toBigDecimal()
}

private fun updateProgramExerciseMetric(
    builder: UpdateBuilder<*>,
    request: UpdateProgramExerciseMetricRequest
) {
    builder[ProgramExerciseMetric.metricTypeId] = request.metricTypeId
    builder[ProgramExerciseMetric.programExerciseId] = request.programExerciseId
    builder[ProgramExerciseMetric.value] = request.value.toBigDecimal()
}

private fun findAllProgramExerciseMetrics(): List<ProgramExerciseMetricDTO> = transaction {
    ProgramExerciseMetric
        .selectAll()
        .map { it.toProgramExerciseMetricDTO() }
}

private fun findProgramExerciseMetricById(id: Long): ProgramExerciseMetricDTO? = transaction {
    ProgramExerciseMetric
        .selectAll()
        .where { ProgramExerciseMetric.id eq id }
        .map { it.toProgramExerciseMetricDTO() }
        .singleOrNull()
}

private fun createProgramExerciseMetricAndReturnId(
    request: CreateProgramExerciseMetricRequest
): Long = transaction {
    ProgramExerciseMetric.insert { builder ->
        createProgramExerciseMetric(builder, request)
    } get ProgramExerciseMetric.id
}

private fun updateProgramExerciseMetricById(
    id: Long,
    request: UpdateProgramExerciseMetricRequest
): Int = transaction {
    ProgramExerciseMetric.update(
        { ProgramExerciseMetric.id eq id }
    ) { builder ->
        updateProgramExerciseMetric(builder, request)
    }
}

private fun deleteProgramExerciseMetricById(id: Long): Int = transaction {
    ProgramExerciseMetric.deleteWhere {
        ProgramExerciseMetric.id eq id
    }
}

fun Route.programExerciseMetricRoutes() { 
    route("/program-exercise-metrics") {
        get {
            val programExerciseMetrics = findAllProgramExerciseMetrics()

            call.respond(HttpStatusCode.OK, programExerciseMetrics)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val programExerciseMetric = findProgramExerciseMetricById(id)

            if (programExerciseMetric == null){ 
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.OK, programExerciseMetric)
            }
        }

        post {
            val request = call.receive<CreateProgramExerciseMetricRequest>()

            val createdProgramExerciseMetricId = createProgramExerciseMetricAndReturnId(request)

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

            val rowsUpdated = updateProgramExerciseMetricById(id, request)

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
            
            val rowsDeleted = deleteProgramExerciseMetricById(id)

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
