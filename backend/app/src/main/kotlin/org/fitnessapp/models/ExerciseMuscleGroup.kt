package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object ExerciseMuscleGroup : Table("exercise_muscle_group") {
    val exerciseId = reference("exercise_id", Exercise.id)
    val muscleGroupId = reference("muscle_group_id", MuscleGroup.id)

    override val primaryKey = PrimaryKey(exerciseId, muscleGroupId)
}