package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.MuscleGroup
import org.fitnessapp.models.MuscleGroupDTO

fun Route.muscleGroupRoutes() {
    route("/muscle-groups") {
        get {
            val muscleGroups = transaction { 
                MuscleGroup.selectAll().map { 
                    MuscleGroupDTO(
                        id = it[MuscleGroup.id],
                        name = it[MuscleGroup.name]
                    )
                }
            }

            call.respond(HttpStatusCode.OK, muscleGroups)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val muscleGroup = transaction {
                MuscleGroup.selectAll().where { MuscleGroup.id eq id }
                    .map {
                        MuscleGroupDTO(
                            id = it[MuscleGroup.id],
                            name = it[MuscleGroup.name]
                        )
                    }.singleOrNull()
            }

            if (muscleGroup == null) {
                call.respond(HttpStatusCode.NotFound, "Muscle group not found")
            } else {
                call.respond(HttpStatusCode.OK, muscleGroup)
            }
        }
    }
}