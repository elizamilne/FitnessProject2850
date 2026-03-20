package org.example.models
import org.jetbrains.exposed.sql.Table
object MetricType : Table("metric_types") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255)
    override val primaryKey = PrimaryKey(id)
}