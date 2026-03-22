package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object MetricType : Table("metric_type") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class MetricTypeDTO(
    val id: Long? = null,
    val name: String
)
