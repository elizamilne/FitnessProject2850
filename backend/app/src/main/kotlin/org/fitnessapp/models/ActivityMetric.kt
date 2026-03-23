package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object ActivityMetric : Table("activity_metric") {
    val id = long("id").autoIncrement()
    val activityId = optReference("activity_id", Activity.id)
    val metricTypeId = optReference("metric_type_id", MetricType.id)
    val value = decimal("value", 10, 2).nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ActivityMetricDTO(
    val id: Long? = null,
    val activityId: Long?,     
    val metricTypeId: Long?,   
    val value: Double?        
)
