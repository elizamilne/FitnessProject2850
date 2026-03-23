package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable
import org.fitnessapp.models.ProgramExerciseMetricRequest
import org.fitnessapp.models.ProgramExerciseMetricDTO

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

@kotlinx.serialization.Serializable
data class ProgramExerciseWithMetricsDTO(
    val programExerciseId: Long,
    val exerciseName: String,
    val image: String,
    val metrics: List<ProgramExerciseMetricDTO> 
)

@Serializable
data class CreateProgramExerciseRequest(
    val programId: Long,
    val exerciseId: Long,
    val metrics: List<ProgramExerciseMetricRequest> 
)


@Serializable
data class MetricRequest(
    val metricTypeId: Long,
    val value: Double
)
