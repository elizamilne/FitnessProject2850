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

import org.jetbrains.exposed.dao.id.EntityID
import java.math.BigDecimal

import org.fitnessapp.models.Activity
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.ActivityMetricDTO
import org.fitnessapp.models.CreateActivityMetricRequest

private fun ResultRow.toActivityMetricDTO() = ActivityMetricDTO(
    id = this[ActivityMetric.id],
    activityId = this[ActivityMetric.activityId],
    metricTypeId = this[ActivityMetric.metricTypeId],
    value = this[ActivityMetric.value]?.toDouble()
)

private fun CreateActivityMetricRequest.toActivityMetricDTO(id: Long) = ActivityMetricDTO(
    id = id,
    activityId = activityId,
    metricTypeId = metricTypeId,
    value = value
)

private fun createActivityMetric(
    builder: InsertStatement<*>,
    request: CreateActivityMetricRequest
) {
    builder[ActivityMetric.activityId] = request.activityId
    builder[ActivityMetric.metricTypeId] = request.metricTypeId
    builder[ActivityMetric.value] = request.value?.toBigDecimal()
}

fun Route.activityMetricRoutes() {
    route("/activity-metrics") {

        get("/{activityId}") {
            val activityId = call.parameters["activityId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val activityMetrics = transaction { 
                ActivityMetric.selectAll()
                    .where { ActivityMetric.activityId eq activityId }
                    .map { it.toActivityMetricDTO() }
            }
                
            if (activityMetrics.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "No activity metrics found")
            } else {
                call.respond(HttpStatusCode.OK, activityMetrics)
            }
        }

        post {
            val activityMetric = call.receive<CreateActivityMetricRequest>()

            val activityMetricId = transaction { 
                ActivityMetric.insert { builder ->
                    createActivityMetric(builder, activityMetric)
                } get ActivityMetric.id
            }
            
            call.respond(
                HttpStatusCode.Created, 
                activityMetric.toActivityMetricDTO(activityMetricId)
            )
        }
    }
}