package org.fitnessapp.routes

import org.fitnessapp.services.ActivityMetricService
import org.fitnessapp.services.toActivityMetricDTO

import org.fitnessapp.models.CreateActivityMetricRequest

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*
import io.ktor.server.request.receive
import org.fitnessapp.models.UpdateActivityMetricRequest

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

        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid id")

            val request = try {
                call.receive<UpdateActivityMetricRequest>()
            } catch (e: Exception) {
                return@put call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid request body")
                )
            }

            val rowsUpdated = ActivityMetricService.updateActivityMetricById(id, request)

            if (rowsUpdated == 0) {
                call.respond(
                    HttpStatusCode.NotFound,
                    mapOf("error" to "Activity Metric not found")
                )
            } else {
                call.respond(
                    HttpStatusCode.OK,
                    mapOf("message" to "Activity Metric updated successfully")
                )
            }
        }
    }
}