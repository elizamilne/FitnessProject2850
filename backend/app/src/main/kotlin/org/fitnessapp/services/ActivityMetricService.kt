package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.update

import org.fitnessapp.models.ActivityMetric
import org.fitnessapp.models.ActivityMetricDTO
import org.fitnessapp.models.CreateActivityMetricRequest
import org.fitnessapp.models.UpdateActivityMetricRequest

fun ResultRow.toActivityMetricDTO() = ActivityMetricDTO(
    id = this[ActivityMetric.id],
    activityId = this[ActivityMetric.activityId],
    metricTypeId = this[ActivityMetric.metricTypeId],
    value = this[ActivityMetric.value]?.toDouble()
)

object ActivityMetricService {
    fun updateActivityMetric(
        builder: UpdateBuilder<*>,
        request: UpdateActivityMetricRequest
    ) {
        builder[ActivityMetric.value] = request.value.toBigDecimal()
    }

    fun findActivityMetricsByActivityId(activityId: Long): List<ActivityMetricDTO> = transaction {
        ActivityMetric
            .selectAll()
            .where { ActivityMetric.activityId eq activityId }
            .map { it.toActivityMetricDTO() }
    }

    fun updateActivityMetricById(
        id: Long,
        request: UpdateActivityMetricRequest
    ): Int = transaction {
        ActivityMetric.update({ ActivityMetric.id eq id }) 
        { 
            builder -> updateActivityMetric(builder, request)
        }
    } 
}