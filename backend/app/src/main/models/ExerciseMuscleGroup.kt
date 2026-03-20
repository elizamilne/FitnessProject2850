package org.example.models
import org.jetbrains.exposed.sql.Table
object ExerciseMuscleGroups : Table("exercise_muscle_groups") {
    val exerciseId = reference("exercise_id", Exercise.id)
    val muscleGroupId = reference("muscle_group_id", MuscleGroup.id)

    override val primaryKey = PrimaryKey(exerciseId, muscleGroupId)
}