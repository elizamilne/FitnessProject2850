package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.javatime.*

object Activity : Table("activity") {

    val id = long("id").autoIncrement()

    val date = date("date")

    val profileId = reference("profile_id", Profile.id)

    val programExerciseId = reference("program_exercise_id", ProgramExercise.id)

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ActivityDTO(
    val id: Long? = null,
    val date: String,
    val profileId: Long,
    val programExerciseId: Long,
    val exerciseName: String?,
    val metrics: List<ActivityMetricWithTypeDTO>
)

@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val totalElements: Long
)

@Serializable
data class CreateActivityRequest(
    val date: String,
    val profileId: Long,
    val programExerciseId: Long,
    val metrics: List<CreateActivityMetricRequest>
)

@Serializable
data class BestMetricDTO(
    val programExerciseId: Long,
    val exerciseName: String?,
    val metricTypeId: Long?,
    val metricName: String?,
    val metricUnit: String?,
    val bestValue: Double?
)