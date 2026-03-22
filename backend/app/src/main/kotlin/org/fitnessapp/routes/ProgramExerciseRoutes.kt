package org.fitnessapp.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.math.BigDecimal

fun Route.programExerciseRoutes() {
    route("/program-exercise") {
        post {
            val request = call.receive<AddExerciseRequest>()

            val existingProgram = transaction {
                Program.selectAll()
                    .where { Program.id eq request.programId }
                    .singleOrNull()
            }

            if (existingProgram == null) {
                call.respond(HttpStatusCode.BadRequest, "Program not found")
                return@post
            }

            val existingExercise = transaction {
                Exercise.selectAll()
                    .where { Exercise.id eq request.exerciseId }
                    .singleOrNull()
            }

            if (existingExercise == null) {
                call.respond(HttpStatusCode.BadRequest, "Exercise not found")
                return@post
            }

            val peId = transaction {
                val programExerciseId = ProgramExercise.insert {
                    it[programId] = request.programId
                    it[exerciseId] = request.exerciseId
                } get ProgramExercise.id

                request.metrics.forEach { metric ->
                    val existingMetricType = MetricType.selectAll()
                        .where { MetricType.id eq metric.metricTypeId }
                        .singleOrNull()

                    if (existingMetricType != null) {
                        ProgramExerciseMetric.insert {
                            it[programExerciseId] = programExerciseId
                            it[metricTypeId] = metric.metricTypeId
                            it[value] = BigDecimal.valueOf(metric.value)
                        }
                    }
                }

                programExerciseId
            }

            call.respond(HttpStatusCode.Created, mapOf("id" to peId))
        }

        get("/program/{programId}") {
            val programId = call.parameters["programId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid Program ID")

            val results = transaction {
                (ProgramExercise innerJoin Exercise)
                    .selectAll()
                    .where { ProgramExercise.programId eq programId }
                    .map { row ->
                        val peId = row[ProgramExercise.id]

                        val metrics = (ProgramExerciseMetric innerJoin MetricType)
                            .selectAll()
                            .where { ProgramExerciseMetric.programExerciseId eq peId }
                            .map { mRow ->
                                mapOf(
                                    "metricName" to mRow[MetricType.name],
                                    "value" to mRow[ProgramExerciseMetric.value].toDouble()
                                )
                            }

                        mapOf(
                            "programExerciseId" to peId,
                            "exerciseName" to row[Exercise.name],
                            "image" to row[Exercise.image],
                            "metrics" to metrics
                        )
                    }
            }

            call.respond(HttpStatusCode.OK, results)
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            transaction {
                ProgramExerciseMetric.deleteWhere { programExerciseId eq id }
                ProgramExercise.deleteWhere { ProgramExercise.id eq id }
            }

            call.respond(HttpStatusCode.OK, "Removed")
        }
    }
}