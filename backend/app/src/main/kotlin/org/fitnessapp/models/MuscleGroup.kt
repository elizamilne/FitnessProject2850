package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object MuscleGroup : Table("muscle_group") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class MuscleGroupDTO(
    val id: Long? = null,
    val name: String?
)