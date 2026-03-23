package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.MetricType
import org.fitnessapp.models.MetricTypeDTO

fun Route.metricTypeRoutes() { 
    route("/metrics") {
        get {
            val metricTypes = transaction { 
                MetricType.selectAll().map {
                    MetricTypeDTO(
                        id = it[MetricType.id],
                        name = it[MetricType.name]
                    )
                }
            }

            if (metricTypes.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "Metric Types not found")
            } else {
                call.respond(HttpStatusCode.OK, metricTypes)
            }
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val metricType = transaction {
                MetricType.selectAll().where { MetricType.id eq id }
                    .map {
                        MetricTypeDTO(
                            id = it[MetricType.id],
                            name = it[MetricType.name]
                        )
                    }.singleOrNull()
            }

            if (metricType == null) {
                call.respond(HttpStatusCode.NotFound, "Metric Type not found")
            } else {
                call.respond(HttpStatusCode.OK, metricType)
            }
        }
    }
}