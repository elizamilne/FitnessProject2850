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

import org.fitnessapp.models.Activity
import org.fitnessapp.models.ActivityDTO
import org.fitnessapp.models.CreateActivityRequest

import java.time.LocalDate

private fun ResultRow.toActivityDTO() = ActivityDTO(
    id = this[Activity.id],
    date = this[Activity.date].toString(),
    profileId = this[Activity.profileId],
    exerciseId = this[Activity.exerciseId]
)

private fun CreateActivityRequest.toActivityDTO(id: Long) = ActivityDTO(
    id = id,
    date = date,
    profileId = profileId,
    exerciseId = exerciseId
)

private fun createActivity(
    builder: InsertStatement<*>,
    request: CreateActivityRequest
) {
    builder[Activity.date] = LocalDate.parse(request.date)
    builder[Activity.profileId] = request.profileId
    builder[Activity.exerciseId] = request.exerciseId
}

private fun findActivitiesByProfile(
    profileId: Long,
    date: java.time.LocalDate?
): List<ActivityDTO> = transaction {
    Activity.selectAll().where {
        if (date != null) {
            (Activity.profileId eq profileId) and (Activity.date eq date)
        } else {
            Activity.profileId eq profileId
        }
    }.map {
        it.toActivityDTO()
    }
}

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

            val activities = findActivitiesByProfile(profileId, date)

            call.respond(HttpStatusCode.OK, activities)
        }

        post {
            val activity = call.receive<CreateActivityRequest>()

            val createdActivityId = transaction { 
                Activity.insert { builder ->
                    createActivity(builder, activity)
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