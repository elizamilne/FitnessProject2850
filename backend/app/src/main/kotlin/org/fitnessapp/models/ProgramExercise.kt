package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object ProgramExercise : Table("program_exercise") {
    val id = long("id").autoIncrement()
    val programId = reference("program_id", Program.id)
    val exerciseId = reference("exercise_id", Exercise.id)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ProgramExerciseDTO(
    val id: Long,
    val programId: Long,
    val exerciseId: Long
)