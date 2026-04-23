package org.fitnessapp.routes

import org.fitnessapp.services.ActivityService
import org.fitnessapp.services.toActivityDTO

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*
import io.ktor.http.HttpStatusCode

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

import org.fitnessapp.models.Activity
import org.fitnessapp.models.CreateActivityRequest

fun Route.activityRoutes() { 
    route("/activities") {
        get("/{profileId}") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid profile ID")
            
            val date = call.request.queryParameters["date"]?.let {
                try {
                    java.time.LocalDate.parse(it)
                } catch (e: Exception) {
                    return@get call.respond(HttpStatusCode.BadRequest, "Invalid date format")
                }
            }

            val activities = ActivityService.findActivitiesByProfile(profileId, date)

            call.respond(HttpStatusCode.OK, activities)
        }

        get("/{profileId}/best") {
            val profileId = call.parameters["profileId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid profile ID")
        
            val result = transaction { 
                ActivityService.getBestMetricsByProfile(profileId)
            }

            call.respond(HttpStatusCode.OK, result)
        }

        post {
            val request = call.receive<CreateActivityRequest>()

            val createdActivityId = transaction {
                val currentActivityId = ActivityService.createActivityAndReturnId(request)
                ActivityService.insertMetricsForActivity(currentActivityId, request.metrics)
                currentActivityId
            }
            
            val activity = ActivityService.findActivityById(createdActivityId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)

            call.respond(
                HttpStatusCode.Created,
                activity
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = ActivityService.deleteActivityById(id)

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Activity not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}