package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseDTO

fun Route.exericseRoutes() { 
    route("/exercises") {
        get { 
            val exercises = transaction { 
                Exercise.selectAll().map { 
                    ExerciseDTO(
                        id = it[Exercise.id],
                        name = it[Exercise.name],
                        image = it[Exercise.image]
                    )
                }
            }

            call.respond(HttpStatusCode.OK, exercises)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val exercise = transaction {
                Exercise.selectAll().where { Exercise.id eq id }
                    .map {
                        ExerciseDTO(
                            id = it[Exercise.id],
                            name = it[Exercise.name],
                            image = it[Exercise.image]
                        )
                    }.singleOrNull()
            }

            if (exercise == null) {
                call.respond(HttpStatusCode.NotFound, "Exercise not found")
            } else {
                call.respond(HttpStatusCode.OK, exercise)
            }
        
        }
    }
}