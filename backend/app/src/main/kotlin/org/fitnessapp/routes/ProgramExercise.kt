package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.ProgramExercise
import org.fitnessapp.models.ProgramExerciseDTO

fun Route.programExerciseRoutes() { 
    route("/program-exercise") {
        get {
            val programExercises = transaction { 
                ProgramExercise.selectAll().map { 
                    ProgramExerciseDTO(
                        id = it[ProgramExercise.id],
                        programId = it[ProgramExercise.programId],
                        exerciseId = it[ProgramExercise.exerciseId]
                    )
                }
            }

            call.respond(HttpStatusCode.OK, programExercises)
        }

        get("/{programId}") {
            val programId = call.parameters["programId"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val programExercises = transaction {
                ProgramExercise.selectAll().where { ProgramExercise.programId eq programId }
                    .map {
                        ProgramExerciseDTO(
                            id = it[ProgramExercise.id],
                            programId = it[ProgramExercise.programId],
                            exerciseId = it[ProgramExercise.exerciseId]
                        )
                    }
            }

            if (programExercises.isEmpty()) {
                call.respond(HttpStatusCode.NotFound, "Program Exercise not found")
            } else {
                call.respond(HttpStatusCode.OK, programExercises)
            }
        }

        post {
            val programExercise = call.receive<ProgramExerciseDTO>()

            val programExerciseId = transaction { 
                ProgramExercise.insert {
                    it[programId] = programExercise.programId
                    it[exerciseId] = programExercise.exerciseId
                }
            } get ProgramExercise.id

            call.respond(HttpStatusCode.Created, programExercise.copy(id=programExerciseId))
        }

        delete("/{id}") { 
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val rowsDeleted = transaction {
                ProgramExercise.deleteWhere { ProgramExercise.id eq id }
            }

            if (rowsDeleted == 0) {
                call.respond(HttpStatusCode.NotFound, "ProgramExercise not found")
            } else {
                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}