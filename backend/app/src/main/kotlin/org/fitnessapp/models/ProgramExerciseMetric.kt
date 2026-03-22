package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object ProgramExerciseMetric : Table("program_exercise_metric") {
    val id = long("id").autoIncrement()
    val metricTypeId = reference("metric_type_id", MetricType.id)
    val programExerciseId = reference("program_exercise_id", ProgramExercise.id)
    val value = decimal("value", 10, 2)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ProgramExerciseMetricDTO(
    val id: Long? = null,
    val metricTypeId: Long,
    val programExerciseId: Long,
    val value: Double
)

@Serializable
data class ProgramExerciseMetricUpdate(
    val value: Double
)



