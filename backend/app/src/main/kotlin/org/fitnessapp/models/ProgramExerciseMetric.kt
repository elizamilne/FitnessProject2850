package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

import org.fitnessapp.models.MetricType 

object ProgramExerciseMetric : Table("program_exercise_metric") {
    val id = long("id").autoIncrement()
    val metricTypeId = reference("metric_type_id", MetricType.id)
    val programExerciseId = reference(
        "program_exercise_id", 
        ProgramExercise.id,
        onDelete = ReferenceOption.CASCADE    
    )
    val value = decimal("value", 10, 2)
    override val primaryKey = PrimaryKey(id)
}

// DELETE THIS 
@Serializable
data class ProgramExerciseMetricDTO(
    val id: Long? = null,
    val metricTypeId: Long,
    val programExerciseId: Long,
    val value: Double
)
// ---

@Serializable
data class ProgramExerciseMetricResponseDTO (
    val metricType: MetricTypeDTO,
    val value: Double,
)

@Serializable
data class CreateProgramExerciseMetricRequest(
    val metricTypeId: Long,
    val programExerciseId: Long,
    val value: Double
)

@Serializable
data class UpdateProgramExerciseMetricRequest(
    val value: Double
)

@Serializable
data class ProgramExerciseMetricRequest(
    val metricTypeId: Long,
    val value: Double
)
