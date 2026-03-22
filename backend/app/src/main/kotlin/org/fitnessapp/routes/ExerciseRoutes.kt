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
import org.fitnessapp.models.ExerciseDetailDTO

import org.fitnessapp.models.ExerciseCategory
import org.fitnessapp.models.ExerciseMuscleGroup

private fun ResultRow.toExerciseDTO() = ExerciseDTO(
    id = this[Exercise.id],
    name = this[Exercise.name],
    image = this[Exercise.image]
)

fun Route.exerciseRoutes() { 
    route("/exercises") {
        get {
            val search = call.request.queryParameters["search"]
            val categoryId = call.request.queryParameters["categoryId"]?.toLongOrNull()
            val muscleGroupId = call.request.queryParameters["muscleGroupId"]?.toLongOrNull()

            val exercises = transaction {
                var query = Exercise.selectAll()

                // search (optional)
                if (!search.isNullOrBlank()) {
                    query = query.andWhere {
                        Exercise.name.lowerCase() like "%${search.lowercase()}%"
                    }
                }

                // category filter (optional)
                if (categoryId != null) {
                    val ids = ExerciseCategory
                        .slice(ExerciseCategory.exerciseId)
                        .select { ExerciseCategory.categoryId eq categoryId }
                        .map { it[ExerciseCategory.exerciseId] }

                    query = query.andWhere { Exercise.id inList ids }
                }

                // muscle filter (optional)
                if (muscleGroupId != null) {
                    val ids = ExerciseMuscleGroup
                        .slice(ExerciseMuscleGroup.exerciseId)
                        .select { ExerciseMuscleGroup.muscleGroupId eq muscleGroupId }
                        .map { it[ExerciseMuscleGroup.exerciseId] }

                    query = query.andWhere { Exercise.id inList ids }
                }

                query.map { it.toExerciseDTO() } 
            }

            call.respond(HttpStatusCode.OK, exercises)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val result = transaction {
                val baseInfo = Exercise.selectAll()
                    .where { Exercise.id eq id }
                    .singleOrNull()
                    ?: return@transaction null

                val categories = ExerciseCategory
                    .slice(ExerciseCategory.categoryId)
                    .select { ExerciseCategory.exerciseId eq id }
                    .map { it[ExerciseCategory.categoryId] }

                val muscles = ExerciseMuscleGroup
                    .slice(ExerciseMuscleGroup.muscleGroupId)
                    .select { ExerciseMuscleGroup.exerciseId eq id }
                    .map { it[ExerciseMuscleGroup.muscleGroupId] }

                ExerciseDetailDTO(
                    id = baseInfo[Exercise.id],
                    name = baseInfo[Exercise.name] ?: "",
                    image = baseInfo[Exercise.image] ?: "",
                    categoryIds = categories,
                    muscleGroupIds = muscles
                )
            }

            if (result == null) {
                call.respond(HttpStatusCode.NotFound, "Exercise not found")
            } else {
                call.respond(HttpStatusCode.OK, result)
            }
        }
    }
}