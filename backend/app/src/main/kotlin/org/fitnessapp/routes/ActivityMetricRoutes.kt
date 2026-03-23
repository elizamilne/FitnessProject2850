package org.fitnessapp.routes

import org.fitnessapp.services.ActivityMetricService
import org.fitnessapp.services.toActivityMetricDTO

import org.fitnessapp.models.CreateActivityMetricRequest

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

fun Route.activityMetricRoutes() {
    route("/activity-metrics") {
        get("/{activityId}") {
            val activityId = call.parameters["activityId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val activityMetrics = ActivityMetricService.findActivityMetricsByActivityId(activityId)
                
            if (activityMetrics.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "No activity metrics found")
            } else {
                call.respond(HttpStatusCode.OK, activityMetrics)
            }
        }

        post {
            val activityMetric = call.receive<CreateActivityMetricRequest>()
            
            val activityMetricId = ActivityMetricService.createActivityMetricAndReturnId(activityMetric)
            
            call.respond(
                HttpStatusCode.Created, 
                activityMetric.toActivityMetricDTO(activityMetricId)
            )
        }
    }
}