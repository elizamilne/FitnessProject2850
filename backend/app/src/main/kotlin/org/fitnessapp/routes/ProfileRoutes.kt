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

import java.math.BigDecimal

private fun ResultRow.toProfileDTO() = ProfileDTO(
    id = this[Profile.id],
    userId = this[Profile.userId],
    goal = this[Profile.goal],
    gender = this[Profile.gender],
    age = this[Profile.age],
    level = this[Profile.level],
    weight = this[Profile.weight].toDouble(),
    height = this[Profile.height].toDouble(),
    workoutFrequency = this[Profile.workoutFrequency]
)

private fun CreateProfileRequest.toProfileDTO(id: Long) = ProfileDTO(
    id = id,
    userId = userId,
    goal = goal,
    gender = gender,
    age = age,
    level = level,
    weight = weight,
    height = height,
    workoutFrequency = workoutFrequency
)

private fun createProfile(
    builder: InsertStatement<*>,
    profile: CreateProfileRequest
) {
    builder[Profile.userId] = profile.userId
    builder[Profile.goal] = profile.goal
    builder[Profile.gender] = profile.gender
    builder[Profile.age] = profile.age
    builder[Profile.level] = profile.level
    builder[Profile.weight] = BigDecimal.valueOf(profile.weight)
    builder[Profile.height] = BigDecimal.valueOf(profile.height)
    builder[Profile.workoutFrequency] = profile.workoutFrequency
}

private fun findAllProfiles(): List<ProfileDTO> = transaction {
    Profile.selectAll().map { it.toProfileDTO() }
}

private fun getProfileById(id: Long): ProfileDTO? = transaction {
    Profile.selectAll()
        .where { Profile.id eq id }
        .map { it.toProfileDTO() }
        .singleOrNull()
}

private fun findProfileByUserId(userId: Long): ProfileDTO? = transaction {
    Profile.selectAll()
        .where { Profile.userId eq userId }
        .map { it.toProfileDTO() }
        .singleOrNull()
}

private fun createProfileAndReturnId(profile: CreateProfileRequest): Long = transaction {
    Profile.insert { builder ->
        createProfile(builder, profile)
    } get Profile.id
}

private fun deleteProfileById(id: Long): Int = transaction {
    Profile.deleteWhere { Profile.id eq id }
}

fun Route.profileRoutes() { 
    route("/profiles") { 
        get { 
            val profiles = findAllProfiles()

            call.respond(HttpStatusCode.OK, profiles)
        }

        get("/{id}") { 
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val profile = getProfileById(id)

            if (profile == null ) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        get("/user/{userId}") {
            val userId = call.parameters["userId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid User ID")

            val profile = findProfileByUserId(userId)

            if (profile == null) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else {
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        post { 
            val profile = call.receive<CreateProfileRequest>()

            val createdProfileId = createProfileAndReturnId(profile)

            call.respond(
                HttpStatusCode.Created, 
                profile.toProfileDTO(createdProfileId)
            )
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = deleteProfileById(id)

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}