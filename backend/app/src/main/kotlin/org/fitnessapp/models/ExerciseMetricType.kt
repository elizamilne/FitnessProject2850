package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object ExerciseMetricTypes : Table("exercise_metric_types") {

    val id = long("id").autoIncrement()

    val exerciseId = reference("exercise_id", Exercise.id)
    val metricTypeId = reference("metric_type_id", MetricType.id)

    override val primaryKey = PrimaryKey(id)

    init {
        uniqueIndex("uniq_exercise_metric", exerciseId, metricTypeId)
    }
}

@Serializable
data class CreateExerciseMetricTypeRequest(
    val exerciseId: Long,
    val metricTypeId: Long
)

@Serializable
data class CreateExerciseMetricTypeByNameRequest(
    val exerciseName: String,
    val metricTypeName: String
)