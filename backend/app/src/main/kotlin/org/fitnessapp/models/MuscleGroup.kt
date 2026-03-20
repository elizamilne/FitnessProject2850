package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object MuscleGroup : Table("muscle_group") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    override val primaryKey = PrimaryKey(id)
}