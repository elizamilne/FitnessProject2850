package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.selectAll

import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.ActivityMetricDTO
import org.fitnessapp.models.CreateActivityMetricRequest

fun ResultRow.toActivityMetricDTO() = ActivityMetricDTO(
    id = this[ActivityMetric.id],
    activityId = this[ActivityMetric.activityId],
    metricTypeId = this[ActivityMetric.metricTypeId],
    value = this[ActivityMetric.value]?.toDouble()
)

fun CreateActivityMetricRequest.toActivityMetricDTO(id: Long) = ActivityMetricDTO(
    id = id,
    activityId = activityId,
    metricTypeId = metricTypeId,
    value = value
)

object ActivityMetricService {
    fun createActivityMetric(
        builder: InsertStatement<*>,
        request: CreateActivityMetricRequest
    ) {
        builder[ActivityMetric.activityId] = request.activityId
        builder[ActivityMetric.metricTypeId] = request.metricTypeId
        builder[ActivityMetric.value] = request.value?.toBigDecimal()
    }

    fun findActivityMetricsByActivityId(activityId: Long): List<ActivityMetricDTO> = transaction {
        ActivityMetric
            .selectAll()
            .where { ActivityMetric.activityId eq activityId }
            .map { it.toActivityMetricDTO() }
    }

    fun createActivityMetricAndReturnId(activityMetric: CreateActivityMetricRequest): Long = transaction {
        ActivityMetric.insert { builder ->
            createActivityMetric(builder, activityMetric)
        } get ActivityMetric.id
    }
}