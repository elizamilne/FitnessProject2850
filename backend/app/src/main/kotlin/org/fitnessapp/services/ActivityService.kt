package org.fitnessapp.services

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.fitnessapp.models.*
import java.time.LocalDate
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal
import org.jetbrains.exposed.sql.max
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like

fun ResultRow.toActivityDTO(
    metrics: List<ActivityMetricWithTypeDTO> = emptyList()
) = ActivityDTO(
    id = this[Activity.id],
    date = this[Activity.date].toString(),
    profileId = this[Activity.profileId],

    // 🔥 FIX
    programExerciseId = this[Activity.programExerciseId],

    exerciseName = this[Exercise.name],
    metrics = metrics
)

object ActivityService {

    fun createActivity(
        builder: InsertStatement<*>,
        request: CreateActivityRequest
    ) {
        builder[Activity.date] = LocalDate.parse(request.date)
        builder[Activity.profileId] = request.profileId

        // 🔥 FIX
        builder[Activity.programExerciseId] = request.programExerciseId
    }

    fun createActivityMetric(
        builder: InsertStatement<*>,
        activityId: Long,
        metric: CreateActivityMetricRequest
    ) {
        builder[ActivityMetric.activityId] = activityId
        builder[ActivityMetric.metricTypeId] = metric.metricTypeId
        builder[ActivityMetric.value] = BigDecimal.valueOf(metric.value)
    }

    fun findActivitiesByProfile(
        profileId: Long,
        date: LocalDate?,
        page: Int? = null,
        limit: Int? = null,
        sort: String? = "desc",
        search: String? = null
    ): PaginatedResponse<ActivityDTO> = transaction {

        var condition: Op<Boolean> = Activity.profileId eq profileId

        if (date != null) {
            condition = condition and (Activity.date eq date)
        }

        if (!search.isNullOrBlank()) {
            condition = condition and (Exercise.name.lowerCase() like "%$search%")
        }

        // 🔥 FIXED JOIN
        val baseQuery = Activity
            .innerJoin(ProgramExercise)
            .innerJoin(Exercise)

        val total = baseQuery
            .selectAll()
            .where { condition }
            .count()

        var query = baseQuery
            .selectAll()
            .where { condition }

        val order = if (sort == "asc") SortOrder.ASC else SortOrder.DESC
        query = query.orderBy(Activity.date, order)

        if (page != null && limit != null) {
            val offset = (page - 1) * limit
            query = query.limit(limit, offset.toLong())
        }

        val data = query.map { activityRow ->
            val activityId = activityRow[Activity.id]

            val metrics = (ActivityMetric innerJoin MetricType)
                .selectAll()
                .where { ActivityMetric.activityId eq activityId }
                .map { row ->
                    ActivityMetricWithTypeDTO(
                        name = row[MetricType.name],
                        value = row[ActivityMetric.value]?.toDouble(),
                        unit = row[MetricType.unit]
                    )
                }

            activityRow.toActivityDTO(metrics)
        }

        PaginatedResponse(
            data = data,
            totalElements = total
        )
    }

    fun findActivityById(id: Long): ActivityDTO? = transaction {

        (Activity
            .innerJoin(ProgramExercise)
            .innerJoin(Exercise))
            .selectAll()
            .where { Activity.id eq id }
            .singleOrNull()
            ?.let { activityRow ->

                val activityId = activityRow[Activity.id]

                val metrics = (ActivityMetric innerJoin MetricType)
                    .selectAll()
                    .where { ActivityMetric.activityId eq activityId }
                    .map { row ->
                        ActivityMetricWithTypeDTO(
                            name = row[MetricType.name],
                            value = row[ActivityMetric.value]?.toDouble(),
                            unit = row[MetricType.unit]
                        )
                    }

                activityRow.toActivityDTO(metrics)
            }
    }

    // 🔥 FIXED
    fun getCompletedProgramExerciseIds(
        profileId: Long,
        date: LocalDate
    ): List<Long> = transaction {
        Activity
            .select(Activity.programExerciseId)
            .where {
                (Activity.profileId eq profileId) and
                (Activity.date eq date)
            }
            .map { it[Activity.programExerciseId] }
            .distinct()
    }

    fun getBestMetricsByProfile(profileId: Long): List<BestMetricDTO> {
        val bestValue = ActivityMetric.value.max().alias("best_value")

        return (Activity
            .innerJoin(ActivityMetric)
            .innerJoin(ProgramExercise)
            .innerJoin(Exercise)
            .innerJoin(MetricType))
            .select(
                Activity.programExerciseId,
                Exercise.name,
                ActivityMetric.metricTypeId,
                MetricType.name,
                MetricType.unit,
                bestValue
            )
            .where { Activity.profileId eq profileId }
            .groupBy(Activity.programExerciseId, ActivityMetric.metricTypeId)
            .map { row ->
                BestMetricDTO(
                    programExerciseId = row[Activity.programExerciseId],
                    exerciseName = row[Exercise.name],
                    metricTypeId = row[ActivityMetric.metricTypeId],
                    metricName = row[MetricType.name],
                    metricUnit = row[MetricType.unit],
                    bestValue = row[bestValue]?.toDouble()
                )
            }
    }

    fun createActivityAndReturnId(
        request: CreateActivityRequest
    ): Long = transaction {
        Activity.insert { builder ->
            createActivity(builder, request)
        } get Activity.id
    }

    fun insertMetricIfTypeExists(
        activityId: Long,
        metric: CreateActivityMetricRequest
    ) {
        if (MetricTypeService.metricTypeExists(metric.metricTypeId)) {
            ActivityMetric.insert { builder ->
                createActivityMetric(builder, activityId, metric)
            }
        }
    }

    fun insertMetricsForActivity(
        activityId: Long,
        metrics: List<CreateActivityMetricRequest>
    ) {
        metrics.forEach { metric ->
            insertMetricIfTypeExists(activityId, metric)
        }
    }

    fun deleteActivityById(id: Long): Int = transaction {
        Activity.deleteWhere { Activity.id eq id }
    }

    fun deleteByProgramExercise(
        profileId: Long,
        programExerciseId: Long,
        date: LocalDate
    ): Int = transaction {
        Activity.deleteWhere {
            (Activity.profileId eq profileId) and
            (Activity.programExerciseId eq programExerciseId) and
            (Activity.date eq date)
        }
    }
}