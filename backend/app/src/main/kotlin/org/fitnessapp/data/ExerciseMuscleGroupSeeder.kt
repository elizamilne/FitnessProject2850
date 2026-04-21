package org.fitnessapp.data

import org.fitnessapp.models.Exercise
import org.fitnessapp.models.ExerciseMuscleGroup
import org.fitnessapp.models.MuscleGroup
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.and

object ExerciseMuscleGroupSeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/exercise_muscle_groups.csv")
            ?: error("Cannot find exercise_muscle_groups.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val parts = line.split(",", limit = 2)

                if (parts.size == 2) {
                    val exerciseName = parts[0].trim()
                    val muscleName = parts[1].trim()

                    val exercise = Exercise
                        .selectAll()
                        .where { Exercise.name eq exerciseName }
                        .singleOrNull()

                    val muscle = MuscleGroup
                        .selectAll()
                        .where { MuscleGroup.name eq muscleName }
                        .singleOrNull()

                    if (exercise != null && muscle != null) {
                        val exerciseId = exercise[Exercise.id]
                        val muscleId = muscle[MuscleGroup.id]

                        val exists = ExerciseMuscleGroup
                            .selectAll()
                            .where {
                                (ExerciseMuscleGroup.exerciseId eq exerciseId) and
                                (ExerciseMuscleGroup.muscleGroupId eq muscleId)
                            }
                            .singleOrNull()

                        if (exists == null) {
                            ExerciseMuscleGroup.insert {
                                it[ExerciseMuscleGroup.exerciseId] = exerciseId
                                it[ExerciseMuscleGroup.muscleGroupId] = muscleId
                            }
                        }
                    }
                }
            }
        }
    }
}