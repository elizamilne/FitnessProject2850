package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.ProgramExerciseMetric
import org.fitnessapp.models.ProgramExerciseMetricDTO

import java.math.BigDecimal

fun Route.programExerciseMetricRoutes() { 
    route("/program-exercise-metrics") {
        get {
            val programExerciseMetrics = transaction { 
                ProgramExerciseMetric.selectAll().map {
                    ProgramExerciseMetricDTO(
                        id = it[ProgramExerciseMetric.id],
                        metricTypeId = it[ProgramExerciseMetric.metricTypeId],
                        programExerciseId = it[ProgramExerciseMetric.programExerciseId],
                        value = it[ProgramExerciseMetric.value].toDouble()
                    )
                }
            }

            call.respond(HttpStatusCode.OK, programExerciseMetrics)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val programExerciseMetric = transaction {
                ProgramExerciseMetric
                    .selectAll().where { ProgramExerciseMetric.id eq id }
                    .map {
                        ProgramExerciseMetricDTO(
                            id = it[ProgramExerciseMetric.id],
                            metricTypeId = it[ProgramExerciseMetric.metricTypeId],
                            programExerciseId = it[ProgramExerciseMetric.programExerciseId],
                            value = it[ProgramExerciseMetric.value].toDouble()
                        )
                    }
                    .singleOrNull()
            }

            if (programExerciseMetric == null){ 
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.OK, programExerciseMetric)
            }
        }

        post {
            val request = call.receive<ProgramExerciseMetricDTO>()

            val newId = transaction { 
                ProgramExerciseMetric.insert { 
                    it[metricTypeId] = request.metricTypeId
                    it[programExerciseId] = request.programExerciseId
                    it[value] = request.value.toBigDecimal()
                } get ProgramExerciseMetric.id
            }

            call.respond(
                HttpStatusCode.Created,
                request.copy(id = newId)
            )
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid id")
            
            val request = try {
                call.receive<ProgramExerciseMetricDTO>()
            } catch (e: Exception) {
                return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid request body")
                )
            }

            val rowsUpdated = transaction { 
                ProgramExerciseMetric.update(
                    { ProgramExerciseMetric.id eq id }
                ) {
                    it[metricTypeId] = request.metricTypeId
                    it[programExerciseId] = request.programExerciseId
                    it[value] = request.value.toBigDecimal()
                }
            }

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
            
            val rowsDeleted = transaction {
                ProgramExerciseMetric.deleteWhere { 
                    ProgramExerciseMetric.id eq id 
                }
            }

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise Metric not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
