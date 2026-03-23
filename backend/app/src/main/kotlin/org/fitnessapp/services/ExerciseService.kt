package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.SqlExpressionBuilder.inList
import org.jetbrains.exposed.sql.lowerCase
import org.jetbrains.exposed.sql.andWhere

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseDTO
import org.fitnessapp.models.ExerciseDetailDTO
import org.fitnessapp.models.ExerciseCategory
import org.fitnessapp.models.ExerciseMuscleGroup

fun ResultRow.toExerciseDTO() = ExerciseDTO(
    id = this[Exercise.id],
    name = this[Exercise.name],
    image = this[Exercise.image]
)

object ExerciseService { 
    // Filtering helpers

    fun nameContains(search: String): Op<Boolean> =
        Exercise.name.lowerCase() like "%${search.lowercase()}%"

    // Relation helpers

    fun findExerciseIdsByCategoryId(categoryId: Long): List<Long> = 
        ExerciseCategory
            .selectAll()
            .where { ExerciseCategory.categoryId eq categoryId }
            .map { it[ExerciseCategory.exerciseId] }

    fun findExerciseIdsByMuscleGroupId(muscleGroupId: Long): List<Long> =
        ExerciseMuscleGroup
            .selectAll()
            .where { ExerciseMuscleGroup.muscleGroupId eq muscleGroupId }
            .map { it[ExerciseMuscleGroup.exerciseId] }

    fun findCategoryIdsByExerciseId(exerciseId: Long): List<Long> =
        ExerciseCategory
            .selectAll()
            .where { ExerciseCategory.exerciseId eq exerciseId }
            .map { it[ExerciseCategory.categoryId] }

    fun findMuscleGroupIdsByExerciseId(exerciseId: Long): List<Long> =
        ExerciseMuscleGroup
            .selectAll()
            .where { ExerciseMuscleGroup.exerciseId eq exerciseId }
            .map { it[ExerciseMuscleGroup.muscleGroupId] }

    // Query helpers

    fun findExercises(
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

    fun findExerciseDetailById(id: Long): ExerciseDetailDTO? = transaction {
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
}