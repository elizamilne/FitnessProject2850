package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.Profile
import org.fitnessapp.models.ProfileDTO

import java.math.BigDecimal

fun Route.profileRoutes() { 
    route("/profiles") { 
        get { 
            val profiles = transaction { 
                Profile.selectAll().map {
                    ProfileDTO(
                        id = it[Profile.id],
                        userId = it[Profile.userId],
                        goal = it[Profile.goal],
                        gender = it[Profile.gender],
                        age = it[Profile.age],
                        level = it[Profile.level],
                        weight = it[Profile.weight].toDouble(),
                        height = it[Profile.height].toDouble(),
                        workoutFrequency = it[Profile.workoutFrequency]
                    )
                }
            }

            call.respond(HttpStatusCode.OK, profiles)
        }

        get("/{id}") { 
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val profile = transaction { 
                Profile.selectAll().where { Profile.id eq id }
                    .map {
                        ProfileDTO(
                            id = it[Profile.id],
                            userId = it[Profile.userId],
                            goal = it[Profile.goal],
                            gender = it[Profile.gender],
                            age = it[Profile.age],
                            level = it[Profile.level],
                            weight = it[Profile.weight].toDouble(),
                            height = it[Profile.height].toDouble(),
                            workoutFrequency = it[Profile.workoutFrequency]
                        )
                    }.singleOrNull()
            }

            if (profile == null ) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        get("/user/{userId}") {
            val userId = call.parameters["userId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid User ID")

            val profile = transaction { 
                Profile.selectAll().where { Profile.userId eq userId }
                    .map { 
                        ProfileDTO(
                            id = it[Profile.id],
                            userId = it[Profile.userId],
                            goal = it[Profile.goal],
                            gender = it[Profile.gender],
                            age = it[Profile.age],
                            level = it[Profile.level],
                            weight = it[Profile.weight].toDouble(),
                            height = it[Profile.height].toDouble(),
                            workoutFrequency = it[Profile.workoutFrequency]
                        )
                    }.singleOrNull()
            }

            if (profile == null) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else {
                call.respond(HttpStatusCode.OK, profile)
            }
        }

        post { 
            val profile = call.receive<ProfileDTO>()

            val createdProfileId = transaction { 
                Profile.insert {
                    it[userId] = profile.userId
                    it[goal] = profile.goal
                    it[gender] = profile.gender
                    it[age] = profile.age
                    it[level] = profile.level
                    it[weight] = profile.weight.let { BigDecimal.valueOf(it) }
                    it[height] = profile.height.let { BigDecimal.valueOf(it) }
                    it[workoutFrequency] = profile.workoutFrequency
                } get Profile.id
            }

            call.respond(HttpStatusCode.Created, profile.copy(id=createdProfileId))
        }

        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = transaction {
                Profile.deleteWhere { Profile.id eq id }
            }

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "Profile not found")
            } else { 
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}