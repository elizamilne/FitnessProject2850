package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object MetricType : Table("metric_type") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255)
    override val primaryKey = PrimaryKey(id)
}