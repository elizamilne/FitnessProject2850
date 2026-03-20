package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object ExerciseCategory : Table("exercise_category") {
    val exerciseId = reference("exercise_id", Exercise.id)
    val categoryId = reference("category_id", Category.id)

    override val primaryKey = PrimaryKey(exerciseId, categoryId)
}

