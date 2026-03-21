package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.Activity
import org.fitnessapp.models.ActivityDTO

import java.time.LocalDate

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

            val activities = transaction {
                Activity.selectAll().where {
                    if (date != null) {
                        (Activity.profileId eq profileId) and (Activity.date eq date)
                    } else {
                        Activity.profileId eq profileId
                    }
                }.map {
                    ActivityDTO(
                        id = it[Activity.id],
                        date = it[Activity.date].toString(),
                        profileId = it[Activity.profileId],
                        exerciseId = it[Activity.exerciseId]
                    )
                }
            }

            call.respond(HttpStatusCode.OK, activities)
        }

        post {
            val activity = call.receive<ActivityDTO>()

            val createdActivityId = transaction { 
                Activity.insert {
                    it[date] = LocalDate.parse(activity.date)
                    it[profileId] = activity.profileId
                    it[exerciseId] = activity.exerciseId
                } get Activity.id
            }

            call.respond(HttpStatusCode.Created, activity.copy(id=createdActivityId))
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