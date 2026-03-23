package org.fitnessapp.routes

import org.fitnessapp.services.ActivityService
import org.fitnessapp.services.toActivityDTO

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

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

        post {
            val activity = call.receive<CreateActivityRequest>()

            val createdActivityId = transaction { 
                Activity.insert { builder ->
                    ActivityService.createActivity(builder, activity)
                } get Activity.id
            }

            call.respond(
                HttpStatusCode.Created,
                activity.toActivityDTO(createdActivityId)
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = transaction { 
                Activity.deleteWhere { Activity.id eq id }
            }

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Activity not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}