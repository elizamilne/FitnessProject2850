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

import org.fitnessapp.models.Profile
import org.fitnessapp.models.ProfileDTO
import org.fitnessapp.models.CreateProfileRequest

import org.fitnessapp.services.ProfileService
import org.fitnessapp.services.toProfileDTO

import java.math.BigDecimal

fun Route.profileRoutes() { 
    route("/profiles") { 
        get { 
            val profiles = ProfileService.findAllProfiles()

            call.respond(HttpStatusCode.OK, profiles)
        }

        get("/{id}") { 
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val profile = ProfileService.getProfileById(id)

            if (profile == null ) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        get("/user/{userId}") {
            val userId = call.parameters["userId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid User ID")

            val profile = ProfileService.findProfileByUserId(userId)

            if (profile == null) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else {
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        post { 
            val profile = call.receive<CreateProfileRequest>()

            val createdProfileId = ProfileService.createProfileAndReturnId(profile)

            call.respond(
                HttpStatusCode.Created, 
                profile.toProfileDTO(createdProfileId)
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = ProfileService.deleteProfileById(id)

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}