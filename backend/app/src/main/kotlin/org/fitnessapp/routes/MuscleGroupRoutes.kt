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

private fun ResultRow.toMuscleGroupDTO() = MuscleGroupDTO(
    id = this[MuscleGroup.id],
    name = this[MuscleGroup.name]
)

private fun findAllMuscleGroups(): List<MuscleGroupDTO> = transaction {
    MuscleGroup.selectAll().map {
        it.toMuscleGroupDTO()
    }
}

private fun findMuscleGroupById(id: Long): MuscleGroupDTO? = transaction {
    MuscleGroup.selectAll()
        .where { MuscleGroup.id eq id }
        .map { it.toMuscleGroupDTO() }
        .singleOrNull()
}

fun Route.muscleGroupRoutes() {
    route("/muscle-groups") {
        get {
            val muscleGroups = findAllMuscleGroups()

            call.respond(HttpStatusCode.OK, muscleGroups)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            
            val muscleGroup = findMuscleGroupById(id)

            if (muscleGroup == null) {
                call.respond(HttpStatusCode.NotFound, "Muscle group not found")
            } else {
                call.respond(HttpStatusCode.OK, muscleGroup)
            }
        }
    }
}