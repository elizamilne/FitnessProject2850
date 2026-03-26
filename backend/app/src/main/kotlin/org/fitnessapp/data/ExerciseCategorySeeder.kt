package org.fitnessapp.data

import org.fitnessapp.models.Category
import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseCategory
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.and

object ExerciseCategorySeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/exercise_categories.csv")
            ?: error("Cannot find exercise_categories.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val parts = line.split(",", limit = 2)

                if (parts.size == 2) {
                    val exerciseName = parts[0].trim()
                    val categoryName = parts[1].trim()

                    val exercise = Exercise
                        .selectAll()
                        .where { Exercise.name eq exerciseName }
                        .singleOrNull()

                    val category = Category
                        .selectAll()
                        .where { Category.name eq categoryName }
                        .singleOrNull()

                    if (exercise != null && category != null) {
                        val exerciseId = exercise[Exercise.id]
                        val categoryId = category[Category.id]

                        val exists = ExerciseCategory
                            .selectAll()
                            .where {
                                (ExerciseCategory.exerciseId eq exerciseId) and
                                (ExerciseCategory.categoryId eq categoryId)
                            }
                            .singleOrNull()

                        if (exists == null) {
                            ExerciseCategory.insert {
                                it[ExerciseCategory.exerciseId] = exerciseId
                                it[ExerciseCategory.categoryId] = categoryId
                            }
                        }
                    }
                }
            }
        }
    }
}