package org.fitnessapp.services

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.fitnessapp.models.*
import java.time.LocalDate
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.math.BigDecimal
import org.jetbrains.exposed.sql.max

fun ResultRow.toActivityDTO(
    metrics: List<ActivityMetricWithTypeDTO> = emptyList()
) = ActivityDTO(
    id = this[Activity.id],
    date = this[Activity.date].toString(),
    profileId = this[Activity.profileId],
    exerciseId = this[Activity.exerciseId],
    metrics = metrics
)

// fun CreateActivityRequest.toActivityDTO(id: Long) = ActivityDTO(
//     id = id,
//     date = date,
//     profileId = profileId,
//     exerciseId = exerciseId,
//     metrics = emptyList()
// )

object ActivityService {
    fun createActivity(
        builder: InsertStatement<*>,
        request: CreateActivityRequest
    ) {
        builder[Activity.date] = LocalDate.parse(request.date)
        builder[Activity.profileId] = request.profileId
        builder[Activity.exerciseId] = request.exerciseId
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
        date: java.time.LocalDate?,
        page: Int? = null,
        limit: Int? = null,
        sort: String? = "desc"
    ): List<ActivityDTO> = transaction {
        var query = Activity.selectAll().where {
            if (date != null) {
                (Activity.profileId eq profileId) and (Activity.date eq date)
            } else {
                Activity.profileId eq profileId
            }
        }

        val order = when (sort) {
            "asc" -> SortOrder.ASC
            else -> SortOrder.DESC
        }

        query = query.orderBy(Activity.date, order)

        if (page != null && limit != null) {
            val offset = (page - 1) * limit
            query = query.limit(limit, offset.toLong())
        }
        
        query.map { activityRow ->
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

    fun findActivityById(id: Long): ActivityDTO? = transaction {
        Activity.selectAll()
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

    fun getBestMetricsByProfile(profileId: Long): List<BestMetricDTO> {
        val bestValue = ActivityMetric.value.max().alias("best_value")

        return (Activity 
            .innerJoin(ActivityMetric)
            .innerJoin(Exercise)
            .innerJoin(MetricType)
        )
            .select(
                Activity.exerciseId,
                Exercise.name,
                ActivityMetric.metricTypeId,
                MetricType.name,
                MetricType.unit,
                bestValue
            )
            .where { Activity.profileId eq profileId }
            .groupBy(Activity.exerciseId, ActivityMetric.metricTypeId)
            .map { row -> 
                BestMetricDTO(
                    exerciseId = row[Activity.exerciseId],
                    exerciseName = row[Exercise.name],
                    metricTypeId = row[ActivityMetric.metricTypeId]
                        ?: error("metricTypeId is null"),
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
}


