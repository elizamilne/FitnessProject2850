package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object MetricType : Table("metric_type") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255)
    val unit = varchar("unit", 50).nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class MetricTypeDTO(
    val id: Long? = null,
    val name: String,
    val unit: String?
)
