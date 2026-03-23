package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.jetbrains.exposed.dao.id.EntityID
import java.math.BigDecimal

import org.fitnessapp.models.Activity
import org.fitnessapp.models.MetricType
import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.ActivityMetricDTO

fun Route.activityMetricRoutes() {
    route("/activity-metrics") {

        get("/{activityId}") {
            val activityId = call.parameters["activityId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val activityMetrics = transaction { 
                ActivityMetric.selectAll().where { ActivityMetric.activityId eq activityId }
                    .map {
                        ActivityMetricDTO(
                            id = it[ActivityMetric.id],
                            activityId = it[ActivityMetric.activityId],
                            metricTypeId = it[ActivityMetric.metricTypeId],
                            value = it[ActivityMetric.value]?.toDouble()
                        )
                    }
            }
                
            if (activityMetrics.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "No activity metrics found")
            } else {
                call.respond(HttpStatusCode.OK, activityMetrics)
            }
        }

        post {
            val activityMetric = call.receive<ActivityMetricDTO>()

            val activityMetricId = transaction { 
                ActivityMetric.insert {
                    it[ActivityMetric.activityId] = activityMetric.activityId
                    it[ActivityMetric.metricTypeId] = activityMetric.metricTypeId
                    it[ActivityMetric.value] = activityMetric.value?.let { BigDecimal.valueOf(it) }
                } get ActivityMetric.id
            }
            
            call.respond(HttpStatusCode.Created, activityMetric.copy(id = activityMetricId))
        }
    }
}