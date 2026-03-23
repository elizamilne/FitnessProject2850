package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like

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

// Filtering helpers

private fun nameContains(search: String): Op<Boolean> =
    Exercise.name.lowerCase() like "%${search.lowercase()}%"

// Relation helpers

private fun findExerciseIdsByCategoryId(categoryId: Long): List<Long> = 
    ExerciseCategory
        .selectAll()
        .where { ExerciseCategory.categoryId eq categoryId }
        .map { it[ExerciseCategory.exerciseId] }

private fun findExerciseIdsByMuscleGroupId(muscleGroupId: Long): List<Long> =
    ExerciseMuscleGroup
        .selectAll()
        .where { ExerciseMuscleGroup.muscleGroupId eq muscleGroupId }
        .map { it[ExerciseMuscleGroup.exerciseId] }

private fun findCategoryIdsByExerciseId(exerciseId: Long): List<Long> =
    ExerciseCategory
        .selectAll()
        .where { ExerciseCategory.exerciseId eq exerciseId }
        .map { it[ExerciseCategory.categoryId] }

private fun findMuscleGroupIdsByExerciseId(exerciseId: Long): List<Long> =
    ExerciseMuscleGroup
        .selectAll()
        .where { ExerciseMuscleGroup.exerciseId eq exerciseId }
        .map { it[ExerciseMuscleGroup.muscleGroupId] }

// Query helpers

private fun findExercises(
    search: String?, 
    categoryId: Long?, 
    muscleGroupId: Long?
): List<ExerciseDTO> = transaction {

    var query = Exercise.selectAll()

    if (!search.isNullOrBlank()) {
        query = query.andWhere { nameContains(search) }
    }

    if (categoryId != null) {
        val ids = findExerciseIdsByCategoryId(categoryId)
        if (ids.isEmpty()) return@transaction emptyList()
        query = query.andWhere { Exercise.id inList ids }
    }

    if (muscleGroupId != null) {
        val ids = findExerciseIdsByMuscleGroupId(muscleGroupId)
        if (ids.isEmpty()) return@transaction emptyList()
        query = query.andWhere { Exercise.id inList ids }
    }

    query.map { it.toExerciseDTO() }
}

private fun findExerciseDetailById(id: Long): ExerciseDetailDTO? = transaction {
    val baseInfo = Exercise.selectAll()
        .where { Exercise.id eq id }
        .singleOrNull()
        ?: return@transaction null

    val categories = findCategoryIdsByExerciseId(id) 
    val muscles = findMuscleGroupIdsByExerciseId(id) 

    ExerciseDetailDTO(
        id = baseInfo[Exercise.id],
        name = baseInfo[Exercise.name] ?: "",
        image = baseInfo[Exercise.image] ?: "",
        categoryIds = categories,
        muscleGroupIds = muscles
    )
}

fun findExerciseById(exerciseId: Long): ResultRow? = transaction {
    Exercise
        .selectAll().where { Exercise.id eq exerciseId }
        .singleOrNull()
}

fun Route.exerciseRoutes() { 
    route("/exercises") {
        get {
            val search = call.request.queryParameters["search"]
            val categoryId = call.request.queryParameters["categoryId"]?.toLongOrNull()
            val muscleGroupId = call.request.queryParameters["muscleGroupId"]?.toLongOrNull()

            val exercises = findExercises(search, categoryId, muscleGroupId)

            call.respond(HttpStatusCode.OK, exercises)
        }

        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")

            val result = findExerciseDetailById(id)

            if (result == null) {
                call.respond(HttpStatusCode.NotFound, "Exercise not found")
            } else {
                call.respond(HttpStatusCode.OK, result)
            }
        }
    }
}