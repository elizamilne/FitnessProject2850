package org.example.models
import org.jetbrains.exposed.sql.Table
object ActivityMetric : Table("activity_metric") {
    val id = long("id").autoIncrement()
    val activityId = optReference("activity_id", Activity.id)
    val metricTypeId = optReference("metric_type_id", MetricType.id)
    val value = decimal("value", 10, 2).nullable()
    override val primaryKey = PrimaryKey(id)
}